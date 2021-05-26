from __future__ import print_function
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/drive.activity.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.courses.readonly",]

def action(user_id, course_id, lapse):
    student = {
        'userId': 'me'
    }
    try:
        student = service.courses().students().delete(
            courseId=course_id,
            body=student).execute()
        print(
            '''User {%s} was enrolled as a student in
            the course with ID "{%s} with lapses of {%s} days."'''
            % (student.get('profile').get('name').get('fullName'),
            course_id, lapse))
    except errors.HttpError as error:
        print('The given student is not a member of this course ',error)

def purging():
    det = []
    file1 = open('../data_files/Kick_List.csv', 'r')
    while True:
        line = file1.readline()
        if not line:
            break
        det = line.split(",")
        action(det[0], det[1], det[2])
    file1.close()


def main():
    """Shows basic usage of the Classroom API.
    Prints the names of the first 10 courses the user has access to.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('../data_collectors/token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    service = build('classroom', 'v1', credentials=creds)

    # Call the Classroom API
    results = service.courses().list(pageSize=10).execute()
    courses = results.get('courses', [])

    if not courses:
        print('No courses found.')
    else:
        print('Courses:')
        for course in courses:
            print(course['name'])

if __name__ == '__main__':
    main()
    purging()


TLDR: Update all your projects with the prompt below.  Re-submit Project 1.  Rubric and submissions for Project 2 (admin panel) now open.


Hey class!  Welcome back from vacation!  See below!


Project 1 - Humor Rating App

Before we begin grading your Project 1 assignments, I wanted to alert you all to a database schema update.

I've added four new, non-nullable fields in the staging database to every single table:

created_by_user_id
modified_by_user_id
created_datetime_utc
modified_datetime_utc

These fields are non-nullable.  That means they require a value upon insertion and cannot be updated to NULL.

This is a breaking change for all of your applications.

I've made this change to aid in identifying users who accidentally alter important data in the database.



Here is the prompt I used to update my applications:

**************************
I've added four new, non-nullable fields to every single table in my database.  Those four fields are:

created_by_user_id
modified_by_user_id
created_datetime_utc
modified_datetime_utc

"created_by_user_id" and "modified_by_user_id" should be the profiles.id value of the user creating a new row or updating a row in the database.

"created_datetime_utc" will automatically be set to NOW() by the database upon row insertion.

"modifed_datetime_utc" will automatically be set to NOW() by the database upon row update.

Please go through and update any INSERT or UPDATE queries accordingly.
**************************


Project 2 - Admin Panel:

Also, Project 2 (the admin panel) rubric is now online at https://www.thehumorproject.org/rubric/2 

Please update your admin panels to account for the new fields above and submit the link on the Submissions page for "Project 2": https://www.thehumorproject.org/submissions
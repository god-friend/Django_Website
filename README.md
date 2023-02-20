# Django_Website
A Website for Quiz and Articles

## Getting started
Create a Virtual Environment
> py -m venv /path/to/new/virtual/environment

Change Directory to Environment Directory
>cd /path/to/new/virtual/environment

Activate the Environment
>.\Scripts\activate

 Clone the Repository inside Virtual Evironment 
> git clone https://github.com/god-friend/Django_Website.git

Change Directory
>cd Django_Website

Install requrements.txt
>pip install -r requirements.txt

run commands exactly in this order
>py manage.py makemigrations

>py manage.py migrate

>py manage.py createsuperuser

when creating superuser insert 'AD' in Role input
('AD' is for Admin, 'TE' is for Teacher, 'ST' is for Student)
and then start the server after creating admin user

>py manage.py runserver

After Starting the Server first please load localhost "127.0.0.1:8000"
so the index view can create Groups and then  you are good to go

### Features of Website
1. A Teacher can Create Quiz and check Quiz Created by other Teachers
2. A Student can attempt a Quiz
3. Filter the Quiz either by Category or by Teacher
4. Teacher can Edit thier Quiz from My Account
5. Articles can be created by either Teacher or Student
6. Editing the Article by user

### This Website is Tested in Brave Browser in Windows 10


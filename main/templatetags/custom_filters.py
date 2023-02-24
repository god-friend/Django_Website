from django.template import Library
from json import dumps
from datetime import datetime
from main.models import CustomUser

register = Library()

def get_key(query, key="title"):
    # print(query)
    # print(type(key))
    query = dict(query)
    return query[key]

def get_json(query):
    q = dict(query)
    return dumps(q)

def filter_date(date):
    created = ""
    date_time = datetime.strptime(date, '%Y-%m-%dT%H:%M:%S.%f%z')
    created += str(date_time.day) + "/" + str(date_time.month) + "/" + str(date_time.year) + " "
    created += str(date_time.hour) + ":" + str(date_time.minute) + ":" + str(date_time.second)
    return created

def get_fullname(username):
    user = CustomUser.objects.get(pk=username)
    fullname = user.firstname + " " + user.lastname
    return fullname

def setvar(var=None):
    # print(var)
    return var

def to_list(*args):
    return args

def setrange(start, end):
    return range(start, end+1)

def get_length(var):
    return len(var)

def to_string(var):
    # print(var)
    return str(var)


register.filter('get_key', get_key)
register.filter('json', get_json)
register.filter('f_date', filter_date)
register.filter('fullname', get_fullname)
register.simple_tag(setvar)
register.simple_tag(to_list)
register.filter('setrange',setrange)
register.filter('len', get_length)
register.filter('toString', to_string)
from article.models import Comments
from django.dispatch import receiver
from django.db.models.signals import post_save
from article.models import Notification


@receiver(post_save, sender=Comments)
def check(sender, instance, created, **kwargs):
    if instance.is_parent:
        data = {
            "is_read": False,
            "by_user": instance.user,
            "for_user": instance.for_article.created_by,
            "for_article": instance.for_article,
            "notification": "commented '{comment}' ".format(comment=instance.comment),
        }
        Notification.objects.create(**data)
    else:
        data = {
            "is_read": False,
            "by_user": instance.user,
            "for_user": instance.parent.user,
            "for_article": instance.for_article,
            "notification": "replied '{reply}' to your comment '{comment}' ".format(reply=instance.comment,comment=instance.parent.comment),
        }
        Notification.objects.create(**data)

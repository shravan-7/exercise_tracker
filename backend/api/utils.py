from django.utils import timezone
from django.utils.dateparse import parse_date

def parse_date_or_default(date_string, default_days=30):
    if date_string:
        return parse_date(date_string)
    return timezone.now().date() - timezone.timedelta(days=default_days)

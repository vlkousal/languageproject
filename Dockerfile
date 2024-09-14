# Angular
FROM node:22-alpine3.19 as angular
WORKDIR /app
COPY ./front /app
RUN npm install && npm run build --prod

# Django
FROM python:3.10-slim as django
WORKDIR /app
COPY ./back /app
RUN pip install --no-cache-dir -r requirements.txt

# Angular, Django ports
EXPOSE 4200 8000

CMD [ "sh", "-c", "cd /app && python manage.py runserver & cd /app && npx ng serve" ]


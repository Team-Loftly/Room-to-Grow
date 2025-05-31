# To build the frontend:

- docker login (if you're not logged in)
- docker build -t frontend .
- docker run -p 3000:3000 frontend
- access the site at: http://localhost:3000

Right now, this is just a react template project.
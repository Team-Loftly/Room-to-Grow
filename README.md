# Team Loftly (Room to Grow)
- Ted Lee
- Alex Luo
- Kathrina Pillay
- Aryan Sonik

  
Introducing Room to Grow, a productivity web app where users can create and complete tasks to build up their very own virtual study room.
Earn coins and spend them at the Marketplace to buy various decorations for your room! Every minute of focus counts!

## Build Instructions:
- cd frontend
- docker build -t frontend .
- docker run -p 3000:3000 frontend
- access the site at: http://localhost:3000.

## M1

### Home Page
- Added three.js scene with placeholder 3D room model
- Room is rotation and zoom enabled through OrbitControls from the drei import
- Basic lighting and camera settings have been set
- Displays a seperate component for HUD buttons for different features 
- UI styling done through tailwindCSS

### Task Page
- Created form for user to add a new task
  - Form changes depending on if it's a timed task or checkmark task
  - Form clears if "Cancel" is clicked
- Created a stats page on the right side of a book background image using Material UI components and mock redux data to view visual metrics about completed tasks.
- Used Material UI to style "My Tasks" and "My Stats" to fit on pages of a book image 
- Responsive to different screen sizes (landscape mode)

### Sign up & Login Page
- Created a sign up and login form for users to create and account and log in.
- User state is saved in local storage.
- If the user is logged in, sign up/login page redirect to the home page.
- If the user is not logged in, all other pages redirect to the login page.

### Marketplace Page
- Created a item display card on left side of page to show more details and interactions with an item from the marketplace
- Created a grid of item tiles on right side of page to allow users to view the different items from the marketplace.
- Used Material UI for styling and for responsiveness to different screen sizes.

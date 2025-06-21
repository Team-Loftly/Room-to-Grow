# Team Loftly (Room to Grow)
- Ted Lee
- Alex Luo
- Kathrina Pillay
- Aryan Sonik

  
Introducing Room to Grow, a productivity web app where users can create and complete tasks to build up their very own virtual study room.
Earn coins and spend them at the Marketplace to buy various decorations for your room! Every minute of focus counts!

## Build Instructions:
- cd frontend
- docker build -t frontend . (including the ".")
- docker run -p 3000:3000 frontend
- access the site at: http://localhost:3000.

## M2
### Home Page
- Implemented the timer on the HUD using redux
- Replaced the placeholder Three.js room with a custom room, with at least one furniture dynamically loaded in
- Changed styling to make it look better

### Task Page
- Tasks are now pulled from the store and displayed in a list on the "My Tasks" page
- Tasks display a number of checkboxes or a progress bar representing the current progress made
- When the user clicks the "Add Task" button, the button and tasks beneath it are replaced by a form
- If user selects the "timed" type when creating a task, sets the values for hours and minutes, and then switches the type to "checkmark", the hours and minutes fields are set back to null. Applies in the opposite direction as well
- When the user clicks "Save", the task is added to the store
- Implemented form validation so that the user can't click "Save" if a required field is empty
- If the task is expanded and the "Delete" button is clicked, the task is removed from the store and the task is removed from the screen

### Marketplace Page
- Added Redux for the market page and user coins/inventory so now you can purchase some placeholder items and view them from the Edit Room
- Added unique furniture to the store instead of the previous placeholder item.

### Edit Room Page
- Added Redux for the edit room page so you can now view the items you purchased on this page

### Initialize Backend
- Changed are in the `initial-backend` branch
- Added a backend server that has one "get" endpoint that sends mock stats data
- Added CreateAsyncThunk to the metrics slice to allow redux to call the api asynchronusly
- Stats component now calls the api to load in the metrics data and renders it dynamically
- Implemented Docker Compose to have both backend and frontend containers running together

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

## References
- The template for backend server logic was referenced from Alex's A2, linked here: https://github.students.cs.ubc.ca/CPSC455-2025S/students-alex602.
 

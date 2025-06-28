# Team Loftly (Room to Grow)
- Ted Lee
- Alex Luo
- Kathrina Pillay
- Aryan Sonik

  
Introducing Room to Grow, a productivity web app where users can create and complete tasks to build up their very own virtual study room.
Earn coins and spend them at the Marketplace to buy various decorations for your room! Every minute of focus counts!

## Build Instructions:
- go to root directory, where docker-compose.yaml is located
- docker-compose up --build
- access the site at: http://localhost:3000.

## M3

### Marketplace backend
- We've implemented our marketplace backend as follows:
  - There's a /decor API that returns marketplace items stored in our Decorations collection. These items are stored in a json file initially and seeded to our collection when the server initializes.
  - Market items are fetched when you navigate to the marketplace page and then stored in our marketSlice.

### Inventory backend
- We've implemented our user inventory backend as follows:
  - There's a /inventory API with the following endpoints:
    - / -> gets the inventory for the user with the user id assoicated with the given JWT token.
    - /create -> creates a new inventory entry for the user with the user id assoicated with the given JWT token. This is called once when a user registers from the register page.
    - /update -> updates the inventory entry for the user with the user id assoicated with the given JWT token. This is called each time the user's inventory is updated -- coins added/removed, or items purchased.
      - The inventorySlice has spendCoinsAndUpdate, addItemsAndUpdate, and addCoinsAndUpdate, which handle updating the redux state as well as sending an updateInventory request to the backend. Our components will call just these update functions.
  - There's an Inventory collection that maps a user id to coins and decorations - used by our API to track the inventory for each user.
- With this update, we can now create multiple user accounts and persist each user's inventory data independently.

### Security Vulnerability Considerations
- We've added a number of features to ensure our application is secure.
- Registration:
  - There's a new /auth/register endpoint that is hit when a user registers for our app. The user submits an email and password that are sent to the backend API. The password is then hashed using bcrypt and a User object is created and stored in our Users MongoDB collection.
- Login:
  - There's a new /auth/login endpoint that is hit when a user attempts to login. The user's email/password are sent to the backend API. If a User object with the given email is found in our DB, it's hashed password is compared with the unhashed password given by the user. The login is only successful if the passwords match.
- A JWT (JSON web token) is generated based on the user's randomly generated user_id and our secret key. The JWT is returned by our register and login API (lasts 1 hour).
- Protecting Routes in the frontend (JWT):
  - In our frontend, all routes except the login/register page are protected by checking whether there's a valid JWT token stored in localstorage. If there isn't, or if the token is expired, the user will be redirected to the login page to acquire a new JWT token.
- Protecting Endpoints in the backend (JWT):
  - In our backend, all API endpoints except the auth ones require a JWT token to be passed in as a header. This token is then checked for validity before the request is allowed to proceed. This protects against unauthorized requests to our APIs.
- Server side input validation:
  - email: Emails are validated against a regex that checks that they match a valid email format.
  - password: Passwords are validated s.t. their length must be greater than 0. In the future, we can make this more secure by having additional requirements for any passwords (length, special chars, etc).
- Future improvements:
  - Require stronger passwords
  - Add a timeout feature if an incorrect password is entered too many times
  - The isTokenExpired check is stored in the frontend- so maybe it could be disabled by by a malicious person to get by with an invalid token. Even then, the backend API endpoints would be protected as that does its own validation, but there's room for improvement here.
  - As we add more API endpoints, we need to take care to prevent against SQL injection attacks for any endpoints accepting user inputs - especially the tasks page.

## M2
### Home Page
- Implemented the timer as a Dialog popup accesible via the HUD. Implemented with states using Redux.
- Replaced placeholder Three.js room with a custom empty room.
- Layed out skeleton code format for loading in furniture models into room, with one desk and chair loaded in for now.
- Removed Stats button from HUD, as it is accesible via the Tasks page.
- Removed Navigation Bar menu button, and changed Color.

### Task Page
- Tasks are now pulled from the store and displayed in a list on the "My Tasks" page
- Tasks display a number of checkboxes or a progress bar representing the current progress made
- When the user clicks the "Add Task" button, the button and tasks beneath it are replaced by a form
- If user selects the "timed" type when creating a task, sets the values for hours and minutes, and then switches the type to "checkmark", the hours and minutes fields are set back to null. Applies in the opposite direction as well
- When the user clicks "Save", the task is added to the store
- Implemented form validation so that the user can't click "Save" if a required field is empty
- If the task is expanded and the "Delete" button is clicked, the task is removed from the store and the task is removed from the screen and a temporary notification appears informing them that their task was successfully deleted
- When a clicks a checkbox on their checkmark task, their progress is updated and stored
- When all checkboxes are ticked for a task:
  - The user is rewarded with coins
  - The task is removed from the list of tasks to complete
  - A temporary notification appears congratulating the user on completing their task
  - "Tasks Completed" in metrics is updated

### Marketplace Page
- Added Redux for the marketplace page so that users can select and purchase items.
- Added Redux to manage user state for coins and items - so the application can track how many coins the user has as well as which items they own.
- Added some unique furniture items to the marketplace instead of the placeholder items.
- Added the ability for users to purchase items from the marketplace page using their coins.

### Edit Room Page
- Added Redux for the edit room page so you can now view the items you purchased on this page

### Initialize Backend
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
 

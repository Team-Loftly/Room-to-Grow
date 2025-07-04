# Team Loftly (Room to Grow)
- Ted Lee
- Alex Luo
- Kathrina Pillay
- Aryan Sonik

  
Introducing Room to Grow, a productivity web app where users can build up healthy habits to grow and personalize their very own virtual study room.
Earn coins and spend them at the Marketplace to buy various decorations for your room! Every minute of focus counts!

## Build Instructions:
- go to root directory, where docker-compose.yaml is located
- docker compose down -v
- docker compose up --build
- access the site at: http://localhost:3000.

## M3

### Test Suite
- Our test suite is located in backend/test
- We have created test suites for our API calls and operations, mocking real use-cases and scenarios for our application.
- Our testing tools:
  - Test env - Mocha + chai
  - Mocking database functions - sinon
  - Generating the report - mochawesome
  - simulating http reqs - supertest
- backend/test/testApp.js creates a separate test server instance with mocked auth helper functions.
- We use mochawesome to generate an html report of the tests in backend/mochawesome-report/mochawesome.html
- To run the tests:
  - cd backend
  - npm i
  - npm test
  - open backend/mochawesome-report/mochawesome.html in your browser to view the results

### Marketplace
- We've implemented our marketplace backend as follows:
  - There's a /decor API that returns marketplace items stored in our Decorations collection. Items in a seed file will populate the collection, and the API will fetch them from the database.
  - Market items are fetched when you navigate to the marketplace page and then stored in our marketSlice.
- Five new 3D models have been added that are availble for purchase and can be placed in users' rooms

### Rooms backend
- A users Rooms state will store a user's coins and the state of items the user owns in their room.
- We've implemented our user room state backend as follows:
  - There's a /rooms API with the following endpoints:
    - / -> gets the room state and coins for the user with the user id assoicated with the given JWT token.
    - /create -> creates a new rooms entry for the user with the user id assoicated with the given JWT token. This is called once when a user registers from the register page.
    - /update -> updates the rooms entry for the user with the user id assoicated with the given JWT token. This is called each time the user's rooms is updated -- coins added/removed, items purchased or placed/removed/modified.
      - The inventorySlice handles spendCoinsAndUpdate, addItemsAndUpdate, and addCoinsAndUpdate, which handle updating the redux state as well as sending an updateInventory request to the backend. Our components will call just these update functions.
      - The roomsSlice handles operations like modifying the position or rotation of an item, or placing/removing it from the room.
  - There's an Rooms collection that maps a user id to coins and decorations - used by our API to track the room state for each user.
- With this update, we can now create multiple user accounts and persist each user's room data independently.

### Rooms frontend
- The home page and edit room pages now are fully linked. The frontend has been restructured so both pages use a single component Room.jsx to manage the 3D scene.
- When the component is passed isEditable = true, controls are enabled to modify the room and change the state of decorations the user owns. After saving to the backend, upon refresh or navigation to home, the changes will persist.
- Items owned by the user are dynamically imported as seperate jsx asset components based on the modelID passed from the decoration object.
- Things like OrbitControls and React Three Fibers built in tools allowed us to implement intuitive controls for moving around items and rotation.

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

### Edit Room Page
- The user's personalized room model now displays on the left side of the Edit Room page, beside their inventory
- Furniture is dynamically and lazily loaded
- Users can now interact with the items in their room
  - Left clicking on an object picks it up, and clicking a second time places it
  - A selected object can be rotated using the left and right arrow keys
  - Moving the cursor while an object is selected repositions it in the room
  - Users can add or remove an item from the room by clicking on the corresponding item card in their inventory
  - Deselecting an object updates its position and rotation in the redux store
  - When the "Save Changes" button is clicked, the updated list of rooms decorations is sent to the backend

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
 

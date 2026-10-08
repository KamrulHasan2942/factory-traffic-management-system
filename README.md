\# Factory Traffic Management System



\## 1. Project Overview



The Factory Traffic Management System is an event-driven traffic control system designed for managing vehicle movement at a factory junction.



The system processes vehicle sensor events, maintains traffic queues, manages traffic signal phases, handles emergency vehicle priority, supports manual control, and records traffic history.



The project consists of:



\- NestJS backend

\- Next.js frontend dashboard

\- MySQL database

\- REST APIs

\- Traffic signal state management

\- Queue management

\- Emergency vehicle priority

\- Controller status and history tracking



\---



\## 2. Main Features



\### Junction Management



\- Create and view factory junctions

\- Monitor junction status

\- Maintain current and desired traffic signal states



\### Sensor Event Processing



\- Vehicle arrival events

\- Vehicle clearance events

\- Duplicate event detection

\- Event history logging



\### Queue Management



\- Track vehicles waiting at each direction

\- Maintain vehicle information and waiting time

\- Prevent negative queue counts



\### Traffic Control



\- Automatic and manual operating modes

\- NORTH/SOUTH and EAST/WEST phases

\- Safe signal transition logic

\- GREEN -> YELLOW -> ALL\_RED -> conflicting GREEN

\- Prevent conflicting directions from receiving GREEN simultaneously



\### Emergency Handling



\- Emergency vehicle detection

\- Emergency direction tracking

\- Emergency priority over normal traffic



\### Controller Monitoring



\- Desired controller state

\- Actual controller state

\- Controller status

\- Controller timeout/failure information



\### Dashboard



\- Junction status

\- Traffic signals

\- Queue information

\- Emergency information

\- Controller status

\- Recent traffic information



\---



\## 3. Technology Stack



\### Backend



\- NestJS

\- TypeScript

\- TypeORM

\- MySQL

\- JWT Authentication



\### Frontend



\- Next.js

\- React

\- TypeScript

\- Tailwind CSS



\### Development Tools



\- VS Code

\- Postman

\- Git/GitHub



\---



\## 4. Project Structure



factory-traffic-system/

│

├── backend/

│   ├── src/

│   │   ├── auth/

│   │   ├── junctions/

│   │   ├── sensor-events/

│   │   ├── queues/

│   │   ├── history/

│   │   ├── traffic/

│   │   ├── dashboard/

│   │   ├── vehicles/

│   │   ├── drivers/

│   │   └── gates/

│   │

│   ├── .env

│   ├── .env.example

│   └── package.json

│

├── frontend/

│   ├── app/

│   ├── lib/

│   └── package.json

│

└── README.md



\---



\## 5. Traffic Signal Logic



The system uses two non-conflicting traffic phases.



Phase 1:

NORTH + SOUTH



Phase 2:

EAST + WEST



Conflicting directions are never allowed to remain GREEN simultaneously.



A normal phase transition follows:



GREEN

&#x20;  ↓

YELLOW

&#x20;  ↓

ALL\_RED

&#x20;  ↓

Next Phase GREEN



This provides a safety interval before the conflicting phase becomes active.



\---



\## 6. Vehicle Priority



Vehicle priority is considered by the traffic control system:



EMERGENCY

&#x20;   ↓

TRUCK

&#x20;   ↓

FORKLIFT

&#x20;   ↓

EMPLOYEE\_VEHICLE



Emergency vehicles receive the highest priority.



Queue waiting time can also influence traffic decisions to reduce starvation.



\---



\## 7. Important API Endpoints



\### Junctions



GET    /api/junctions

POST   /api/junctions

GET    /api/junctions/:id

GET    /api/junctions/:junctionId/status



\### Sensor Events



POST   /api/sensor-events

GET    /api/sensor-events



\### Queue



GET    /api/junctions/:junctionId/queue

GET    /api/junctions/:junctionId/queue/all



\### Traffic Control



POST   /api/junctions/:junctionId/evaluate

POST   /api/junctions/:junctionId/commands

POST   /api/junctions/controller-events

POST   /api/junctions/controller-events/check-timeouts



\### Authentication



POST   /auth/register

POST   /auth/login



\---



\## 8. Database



The system uses MySQL.



Database name:



factory\_traffic\_db



Database configuration is stored in environment variables.



The actual .env file is intentionally excluded from version control.



Use .env.example as a configuration template.



\---



\## 9. Running the Backend



Navigate to the backend directory:



cd backend



Install dependencies:



npm install



Configure .env.



Then start the backend:



npm run start:dev



Backend runs on:



http://localhost:3000



\---



\## 10. Running the Frontend



Navigate to the frontend directory:



cd frontend



Install dependencies:



npm install



Start the frontend:



npm run dev



If port 3000 is already used by the backend, Next.js runs on another available port, such as:



http://localhost:3001



\---



\## 11. Dashboard



The dashboard displays:



\- Junction information

\- Current traffic mode

\- Current phase

\- Traffic signals

\- Queue information

\- Emergency vehicle status

\- Sensor status

\- Controller status

\- Actual controller state



The dashboard communicates with the NestJS backend using REST APIs.



\---



\## 12. Assumptions / Questions / Requirement Issues



\- The assessment focuses primarily on one factory junction (Junction A).

\- NORTH/SOUTH and EAST/WEST are treated as the two conflicting traffic phases.

\- MySQL is used as the persistent database.

\- REST APIs are used for sensor and controller simulation.

\- MQTT integration was considered optional and therefore was not implemented.

\- A physical traffic controller is simulated through controller events and status information.

\- The frontend is intentionally kept lightweight because the primary focus is the backend traffic-control system.

\- Signal transitions are represented logically through the backend state-management system.



\---



\## 13. Testing



The backend contains automated tests using Jest.



Test command:



npm test -- --runInBand



The project was tested for successful application startup and core backend functionality.



\---



\## 14. Security



Sensitive database credentials are stored in .env.



The .env file must not be committed to GitHub.



A safe configuration template is provided in:



backend/.env.example



\---



\## 15. AI / Tool Usage



AI tools were used as development assistance for:



\- Understanding NestJS architecture

\- Debugging TypeScript errors

\- Designing API structures

\- Reviewing traffic-control logic

\- Generating development guidance

\- Improving documentation



All generated code was reviewed, integrated, tested, and adapted for the requirements of this project.



\---



\## 16. Submission Contents



The submission contains:



\- NestJS backend source code

\- Next.js frontend source code

\- MySQL-based persistence

\- REST API implementation

\- Traffic queue management

\- Traffic signal control logic

\- Emergency vehicle handling

\- Controller status tracking

\- Traffic history

\- Dashboard

\- README documentation

\- Environment configuration example

\- Automated backend tests


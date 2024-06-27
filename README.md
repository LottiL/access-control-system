# access-control-system

Access control system backend for a gym network

### 3 iterations
1. basic functionality
1. ORM, automated tests
1. email API, job queue, job scheduling

### Roles
- guest
- staff

### Entities
- user
- RF card
- gym
- pass

### Pass types
- monthly single-gym anytime
- monthly multi-gym anytime
- monthly single-gym off-peak
- monthly multi-gym off-peak

## Stories

### Iteration 1
- As a staff member I want to log in.
- As a staff member I want to register a new guest.
- As a staff member I want to create an RF card for a guest.
- As a staff member I want to create a pass for a guest.
- As a staff member I want to check a visitor's pass using their RF card.
- As a staff member I want to replace a lost or stolen RF card.
- As a visitor I want to enter a gym with my RF card if I have a valid pass.

### Iteration 3
- As a visitor I want to be notified when a pass is created for me.
- As a visitor I want to be notified when my pass expires.
- As a visitor I want to receive an invoice when a pass is created for me.

## Technologies

### Iteration 1
- https://expressjs.com/
- https://github.com/sidorares/node-mysql2

### Iteration 2
- https://sequelize.org/
- https://jestjs.io/
- https://github.com/ladjs/supertest

### Iteration 3
- https://github.com/node-cron/node-cron
- https://bullmq.io/

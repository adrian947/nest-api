<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# TESLO API

## Initial Setup

1. Start the database using Docker:
    ```bash
    docker compose up -d
    ```

2. Copy the `.env.template` file and rename it to `.env`. Then, fill in the environment variables in the new file.

3. Run the seed to populate the database through the following endpoint: [http://localhost:3000/api/seed](http://localhost:3000/api/seed)

4. Run app:
   ```bash
   npm run start:dev
   ```

## Database Migrations

### Create Migration

To create a new migration, use the following command:
```bash
npm run migration:create --name=add-column-userId
```
### Run Migrations

Apply the migrations to the database with the following command:
```bash
npm run migration:run
```
### Revert Migrations

If needed, revert a migration using the following command:
```bash
npm run migration:revert
```

## Documentation

Explore the following documentation for detailed information on endpoints and usage:

- **Postman Documentation:**
  - [Documentation Swagger](https://documenter.getpostman.com/view/14487673/2sA2r3aRvh)

- **Swagger Documentation:**
  - The API is hosted at `YOUR_HOST/api`.
  - Example URL: [http://localhost:3000/api/](http://localhost:3000/api/)
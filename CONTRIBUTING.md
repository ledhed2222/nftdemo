# CONTRIBUTING

## Initial setup
### Install backend dependencies
- install postgres. on mac:
  - `brew install postgresql`
  - `brew services start postgresql`
- install ruby. `rbenv` is recommended.
- install dependencies: `bundle install`
- setup database: `rake db:setup`
### Install frontend dependencies
- install node. `nodenv` is recommended.
- install dependencies: `cd client && npm install`
### Configuration
You must set up your .env. See the .env.example file for details.

## Running locally
`foreman start -f Procfile.dev`

## Deploying
Any merge into master will deploy on Heroku.

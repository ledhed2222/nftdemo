desc "Deploy application"
task :deploy do
  before_dir = Dir.pwd
  Dir.chdir("./client")
  `npm install`
  `npm run build`
  Dir.chdir(before_dir)
  `git checkout master`
  `git pull`
  `git push heroku`
end

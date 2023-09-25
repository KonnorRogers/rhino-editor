namespace :build do
  # Gets around annoying caching locally
  desc "build clean"
  task clean: :environment do
    system("bin/vite build --clean")
  end

  desc "build all"
  task all: :environment do
    Rake::Task["assets:clobber"].execute
    Rake::Task["build:clean"].execute
    Rake::Task["assets:precompile"].execute
  end
end

Rake::Task["assets:precompile"].enhance([Rake::Task["assets:clobber"], Rake::Task["build:clean"]])



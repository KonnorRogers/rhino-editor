# Purpose

To create a grab and go WYSIWYG editing experience that can
hook into Ruby on Rails ActionText backend. Currently this
package does so using [TipTap](https://tiptap.dev/) but
will most likely include another integration for [ProseMirror](https://prosemirror.net/)
to allow for both Markdown + WYSIWYG editing.

> Note: This package is still in beta and is currently not
recommended for production use until a 1.0 is released.

## Getting started

> This will not give you the proper package, I merely
created a placeholder.

```console
npm install tip-tap-element

# OR

pnpm add tip-tap-element

# OR

yarn add tip-tap-element
```

## Local Development

Getting up and running locally is hopefully quite painless.
We have a test suite using Ruby on Rails and is intended to
provide a good demonstration of how this package can hook
into ActionText.

### Prerequisites

- Ruby 3.1.2
- Rails 7.0.4
- PNPM (`npm install -g pnpm`)
- Playwright
- Node >= 16
- Docker (Used to run a simulated S3 server)
- Overmind (Preferred, not needed)

### Installation

Run the following commands in the console to setup
dependencies:

```console
git clone https://github.com/paramagicdev/tip-tap-element
cd tip-tap-element
pnpm install
cd test/rails
pnpm install && npx playwright install --with-deps
bundle install
```

### Running the server

The easiest way to run the server is using [Overmind](https://github.com/DarthSim/overmind)

```console
overmind start -f Procfile.dev
```

Then navigate to `localhost:5100`


#### Without Overmind

To run the server without overmind do the following in
seperate terminals:

```console
bin/vite dev --clobber
bin/rails s
docker compose up --build
```

Then navigate to `localhost:5100`

### Running the test suite

Make sure to have the docker server up and running, the
test suite will fail without it.

```console
docker compose up --build
bundle exec rails test:all
```

### Listening for changes to the package

To listen for changes, keep your rails server running and
open a new terminal with the following:

```console
pnpm run start
```

This will start an ESBuild watcher process. Vite in Rails
will automatically pick up changes.

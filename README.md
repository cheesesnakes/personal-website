My personal website, built using Jekyll and self-hosted. 

Based on [al-folio](https://github.com/alshedivat/al-folio)

### Usage

Make your changes in the root directory then spin up the `website_builder` container to build the site.

```bash
docker compose -f docker-compose-dev.yml up -d
```

Then run the following command to build the site.

```bash
docker exec -it website_builder bash -c "bundle install && bundle exec jekyll build"
```

The development container serves the site at <http://localhost:4080> and rebuilds it when files change.

For deployment, spin up nginx. You will have to restart or recreate the nginx container if you make changes to the site.

```bash
docker compose -f docker-compose.yml up -d
```

or

```bash
docker compose -f docker-compose.yml restart
```

Shut down the container when you're done:

```bash
docker compose -f docker-compose-dev.yml down
```

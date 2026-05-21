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

Spin up nginx to serve the site. You will have to restart or recreate the nginx container if you make changes to the site.

```bash
docker compose -d
```

or

```bash
docker compose restart
```

Shut down the container when you're done:

```bash
docker compose -f docker-compose-dev.yml down
```

My personal website, built using Jekyll and self-hosted. 

Based on [al-folio](https://github.com/alshedivat/al-folio)

### Usage

Make your changes in the root directory, then start the development container:

```bash
docker compose -f docker-compose-dev.yml up -d
```

The container installs the dependencies and runs Jekyll's watch server. Open <http://localhost:4080> to view the site. Port `4080` on your machine maps to port `8080` in the container; live reload uses port `35729`. Changes to the mounted project files are rebuilt automatically.

To follow the development server logs:

```bash
docker compose -f docker-compose-dev.yml logs -f
```

To generate the static site manually instead of relying on the watch server:

```bash
docker exec -it website_builder bundle exec jekyll build
```

For deployment, the nginx container serves the prebuilt site from `/home/cheesesnakes/apps/website/_site` on the Docker host. Put the generated Jekyll output in that directory before deploying; this path is specific to the deployment host. The Compose configuration also expects an existing external Docker network named `proxy`, connected to Traefik.

```bash
docker compose -f docker-compose.yml up -d
```

Since nginx reads the site through a bind mount, updating the files in that directory does not require restarting nginx. To restart the container explicitly:

```bash
docker compose -f docker-compose.yml restart
```

Shut down the development container when you're done:

```bash
docker compose -f docker-compose-dev.yml down
```

To shut down the deployment container:

```bash
docker compose -f docker-compose.yml down
```

# SOEN 357 Project

[![Linting](https://github.com/gordonpn/soen-357/actions/workflows/linting.yml/badge.svg)](https://github.com/gordonpn/soen-357/actions/workflows/linting.yml)

[![Cloudflare](https://www.cloudflare.com/media/images/web-badges/cf-web-badges-f-1.png)](https://soen-357.pages.dev/)

## Live Parking Finder Prototype

### Description

This prototype was developed within the scope of a university research project in UI/UX.

#### The problem we are trying to solve

Provide a web application for drivers to use to reduce traffic congestion in high density areas of a city by displaying available street parking space in real-time.

#### Limitation

The features of this prototype cannot be used in the real world and is limited to the city of Montreal, Canada currently.

#### Features

- Find available and occupied street parking spaces in Montreal.
- Get directions to the available selected parking space.
- View information about the parking space such as hourly rate and paid hours.

### Getting started with development

Install Node.js v15+.

After cloning this repository, you must use `npm install` to install all dependencies.

You will also need to add a [Mapbox](https://www.mapbox.com/) API token in the `.env` file at the root of the project.

```bash
REACT_APP_MAPBOX=pk...Q
```

To start the development local webserver, use `npm start`.

Data provided by [Montreal Open Data](https://donnees.montreal.ca/agence-de-mobilite-durable/stationnements-municipaux-tarifes-sur-rue-et-hors-rue).

#### Deployment

To bundle the files for deployment, use `npm run build`.

This project is currently deployed on [Cloudflare Pages](https://pages.cloudflare.com/).

This project was bootstrapped with create-react-app and the [Waver](https://reactsaastemplate.com/) template was used for quick prototyping.

## Team members

| Name                  | ID       |
| --------------------- | -------- |
| Gordon Pham-Nguyen    | 40018402 |
| Mackenzie Bellemore   | 40062494 |
| David Liang           | 40092433 |
| Kelvin Chow Wan Chuen | 40029677 |

## License

[MIT License](./LICENSE)

<div style="text-align: center">
<img src="./grupago.svg" width="50"><br>

<img src="https://badges.aleen42.com/src/typescript.svg?sanitize=true">
<img src="https://badges.aleen42.com/src/react.svg?sanitize=true">
<img src="https://badges.aleen42.com/src/python.svg?sanitize=true">
<img src="https://badges.aleen42.com/src/webpack.svg?sanitize=true">
<img src="https://badges.aleen42.com/src/redux.svg?sanitize=true">
</div>

# Mobile Warehouseman - backend + web app

![Mobile Warehouseman promo](https://grupago.pl/wp-content/uploads/2022/04/MagazynierConcated.jpg)

## Documentation

- [Description](#description)
- [Main functionalities](#main-functionalities)
- [Use Cases](#use-cases)
- [Code structure](#code-structure)
- [List of other modules](#list-of-other-modules)

## Description

<!--- This is a backend + web app for mobile warehouseman mobile app. It's a warehouse management system. --->

This is a backend + web app for mobile warehouseman mobile app. It's a warehouse management system.\
Project landing page is available on: \
<a href="https://grupago.pl/em_portfolios/mobilny-magazynier/" target="_blank">Mobile Warehouseman</a>

The application was developed for Android and iOS smartphones and Honeywell ScanPal EDA60k data collectors. Currently, it works with ERP systems that have CSV file import and with Prestashop, while there is the possibility of adapting it to any other e-commerce or warehouse and ERP system.

Mobile Warehouseman consists of a smartphone app and a web application.

## Main functionalities

Main functionalities of the application:

- Searching for products using a barcode scanner with a camera or laser (data collector), which allows for displaying detailed information about the product such as purchase price, link with graphics to the store, selling price, description, margin, etc.

<iframe width="560" height="315" src="https://www.youtube.com/embed/wQcM_Hz6SgY?si=UOc_c8-O08BbYq42" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<br>
<br>

- Creating documents in the application or CSV files based on scanned codes or searched products, which can be imported into external ERP systems.

<iframe width="560" height="315" src="https://www.youtube.com/embed/mXQ2n1XhaLo?si=JYbWhls6pAYDpdhh" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/HLaCyxISRn0?si=bHSkqL0OkiiSukNG" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<br>
<br>

- Verification of documents from external systems, which allows the application to download a list of document items (e.g., from an ERP system) or orders (e.g., from a store based on the Prestashop system) for physical verification of goods.

<iframe width="560" height="315" src="https://www.youtube.com/embed/PkBm535tr-U?si=sGJ-KYEr1QmJYTiR" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/jlDnIO8ILb8?si=rvxWpB9AxWSyjtdz" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<br>
<br>

- Generating self-adhesive labels with barcodes directly from a previously created product list or a currently searched or scanned product, and printing them on printers supporting the ZPL2 language.

<iframe width="560" height="315" src="https://www.youtube.com/embed/OksZrUn3In0?si=VfSPBlSNngld8uP-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/PI0pK6SRQ7I?si=gb3KtIqO1cLi6eFg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<br>
<br>

- Preparing inventory documents (CSV)

## Use cases

Main advantages of using the application for:

Salesperson

- Immediate knowledge of purchase prices, stock levels, and margins while being with the customer at the shelf.
- Ability to verify the product for data accuracy and stock levels.
- Ability to create orders from the phone.

Warehouseman / Supply Officer

- Ability to verify purchase documents with physically received items.
- Ability to verify warehouse issues with physically issued items.
- Ability to verify stock levels and location information.
- Ability to print barcode labels and immediately label items using a portable ZEBRA printer.
- Ability to create orders from the phone.

## Code structure

The project consists of three parts:

- Backend - written in Python, using the Django framework, and the Django REST Framework library.

- Web application - written in TypeScript, using the React framework, and the Redux library.

- Mobile application - written in TypeScript, using the React Native framework, and the Redux library.

Most of important code is located in the `modules` directories.

The web application is a dashboard. There is a lot of modules that are not connected with mobile app, but they are some kind of scripts used by warehouseman or accountants.

There is API for mobile application located in `modules/supermagazynier` directory, other modules are responsible for other sub systems and are not connected with mobile application.

Each module has an `web` directory, which contains the web application react components, that in the end are bundled by webpack into `static/frontend/main.js` file.

## List of other modules

- `modules/allegrofv` - module that helps accountants to manage allegro fvs
- `modules/eantocsv` - module that helps to convert excel files with ean codes to csv file that can be imported to Enova 365 ERP system
- `modules/inventoryturnoverratio` - module that helps accountants to calculate inventory turnover ratio
- `modules/plancreator` - module for creating working time record card
- `modules/supercomparer` - module that compares prices of `winien/ma` excel file. `Winien/ma` is an excel file with listed expenses and revenues. It compares prices of expences documents with revenues documents and shows differences. It helps accountants to find mistakes in documents
- `modules/users` - module for managing users of the system (including dashboard and mobile app)
- `modules/vatcomparer` - i dont really remember what it does, but it helps accountants to compare vat documents
- `modules/winienma` - same as `supercomparer` but in supercomparer is an linked version for php external script, heres its coded locally


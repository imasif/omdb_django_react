== The movedb and omdb combined python(django) & reactjs app ==


== How to install ==

== Django App: ==

    1. Create a mysql database naming `omdb_movies`
    2. inside `/omdb_movies_api/omdb_movies/settings.py` change `DATABASES` username, password
    3. cd to `/omdb_movies_api` install Virtual env:
    
        1. On unix terminal run:
            `python3 -m venv env`
            `. venv/bin/activate`
        2. windows powershell run:
            `python -m venv env`
            `.\env\Scripts\activate`
    4. Run `pip install -r requirements.txt`
    5. Run `python manage.py migrate`
    6. Run `python manage.py createsuperuser --email myname@email.com`
    7. Fill up the forms and press enter, please don't use any common password
    8. Run app: python manage.py runserver`
    9. if everything goes ok, you will be able to browse: `http://127.0.0.1:8000/api/`

== React App: ==

    1. open a new terminal/powershell `omdb_movies_frontend` run `npm i && npm start` you'll see site on `http://localhost:3000`
        (if something went wrong delete node_modules & package-lock.json & yarn.lock rerun `npm i && npm start`)

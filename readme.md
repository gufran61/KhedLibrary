# Form To Excel Sheet Setup

#### Prerequisites

1. Node.js should be installed in the system

2. MongoDB should be installed in the system

#### Download Node.js from this website

```
https://nodejs.org/en/download/package-manager
```

#### Download MongoDB from this website

```
https://www.mongodb.com/try/download/community
```

### After Installation Follow These Steps

1. Clone git repository

```
git clone git@github.com:AmmarTheDeveloper/node-with-excel.git
```

2. Move to cloned repo directory

```
cd node-with-excel
```

3. Create a file named .env and add a variable MONGO_URL and set your database url in it.

   - if want to set local system database url use this

   ```
   MONGO_URL=mongodb://localhost:27017
   ```

4. Install all packages

```
npm i
```

## Running the program

- For running in development run this command

```
node index.js
```

- if want to run the program in such away it should run until computer shutdown or it should run even if error occured use this

```
npm i -g pm2
```

```
pm2 start index.js
```

- if want to stop the pm2 use this

```
pm2 stop index.js
```

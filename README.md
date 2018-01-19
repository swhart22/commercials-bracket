# NBC OTS Digital Bracket Tool
This is a node.js project for brackets used on our sites. It features live editing capability via Google Sheets (with Sheetsy), and webpack's hot reload functionality for development.
## Requirements
Before you get started, you should have the latest version of Node installed on your machine. That should be it, but if you run into any weird errors just let me know. 
## Development
Navigate to the empty directory you've created for your project. Then run: 
```
curl -fsSL https://github.com/swhart22/bracket-tool/archive/master.tar.gz | tar -xz --strip-components=1
```
Then:
```
npm i
```
Then:
```
npm run start
```
If all went well, your browser should open up a tab on localhost:3000 with the development version of a bracket. 

You now want to link up your project's spreadsheet with the project. Change the `"SPREADSHEET_URL"` variable in `./src/js/proj-config.js` to the URL of your spreadsheet once you've made it public. 

You should also specify here whether the bracket is a 16- or 32- seed. The code is designed to take the first 16 or 32 rows of whatever dataset on that basis. It will still work if there aren't those exact numbers of items in the sheet, but make sure there are. 

See a sample sheet here: https://docs.google.com/spreadsheets/d/1R8A_X3mQl872Cwroc947SAtFyw7xyqW3m_BJNU3sLjM/edit#gid=0 

Keep the header values the same, and in the columns that include data validation, you need to make sure those values are the ones in your spreadsheet as well, or else the code won't work.

For intermediate phases of the tournament, leave the appropriate columns blank and the graphic will have those lines and nodes greyed out. For competitors that were out in a previous round, make sure you mark 'N/A' 

You can tinker with the project in development mode as needed. Changes to code will reload live, you'll have to refresh after making changes to the Google Sheet. 

## Production

Once you've made sure the bracket looks like it's supposed to, run:
```
npm run build
```
Open the root folder of your directory, and you'll now see a 'dist' folder. The files inside are the ones you need to push to the server. Webpack has bundled everything into minimally-sized files to make you and everyone's browsers' lives easier!

Test the `index.html` file in your browser just to make sure everything worked, and then push to the server. 
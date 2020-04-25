# COVID Tracking Add-on for Google Sheets

This is the repository for the COVID Tracking Google Sheets Add-on.

## Why

Inspired by [The COVID Tracking Project](https://covidtracking.com/), this add-on tries to make it even easier for others to pull in data from the project directly into a Google Spreadsheet.

## How to Install

The first step is to open up the sheet you want to use this add-on in. Next, click the menu Tools > Script editor.

![script editor screenshot](/screenshots/script-editor.png)

This will open up a new window with an empty Google Script editor view.

![google script editor view](/screenshots/google-script-editor-view.png)

Delete all of the existing code in the editor. Then copy and paste the code located in the [Code.js](Code.js) file in this repository into the blank editor. Save the file.

It will ask you for a name for this project, choose whatever name you want.

Next, go to File > New > HTML file.

![new HTML file](/screenshots/new-html-file.png)

It will then ask you to enter a new file name. **Important**, set the file name as *Documentation* (leave off the .html extension name).

This will open a new html file with some code in it. Delete all the code in this file. Then open up the file in this respository called [Documentation.html](Documentation.html) and copy and paste all of the code in this file into the empty html file in the Google Script editor. Save this file.

You are now ready to use the add-on!

## How to Use

After installing the add-on for the first time, you'll have to reload your spreadsheet's browser page. If everything was installed properly, you should now see a new menu in your spreadsheet called *COVID Tracking*.

To use the tool, select the menu COVID Tracking > Documentation.

### First Use

If this is the first time setting it up, Google sheets will ask for your permission to run the script.

Click Continue, then select your user account, and allow the tool access. 

**Note:** If you see a warning that the add-on is not verified, you can still proceed by clicking *Advanced* and then proceed anyways. This warning shows because the add-on has not been verified by Google since it is open source and not an official Google Sheets add-on.

A side bar menu should now open up on the righthand side of your sheet, with the documentation for how to use the add-on.


## Contributing
* Check out the latest master to make sure the feature hasn't been implemented or the bug hasn't been fixed yet
* Check out the issue tracker to make sure someone already hasn't requested it and/or contributed it
* Fork the project
* Start a feature/bugfix branch
* Commit and push until you are happy with your contribution


## License

Released under the MIT License. See [MIT License](LICENSE) or http://opensource.org/licenses/MIT for more information.

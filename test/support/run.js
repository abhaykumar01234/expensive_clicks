const Jasmine = require("jasmine");
const jasmine = new Jasmine();
jasmine.loadConfigFile("test/support/jasmine.json");
jasmine.execute();

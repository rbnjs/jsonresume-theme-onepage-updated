var fs = require("fs");
var path = require('path');
var Handlebars = require("handlebars");
const HandlebarsI18n = require("handlebars-i18n");
const i18next = require("i18next");

let locale = process.env.LOCALE || 'en'

i18next.init({
	resources: {
		"en": {
			translation: {
				"education": "Education",
				"awards": "Awards",
				"certificates": "Certificates",
				"interests": "Interests",
				"languages": "Languages",
				"projects": "Projects",
				"publications": "Publications and talks",
				"references": "References",
				"skills": "Skills",
				"volunteering": "Volunteering",
				"experience": "Experience",
				"present": "Present",
				"highlights": "Highlights" ,
				"score": "Score" 
			}
		},
		"zh": {
			translation: {
				"education": "教育",
				"awards": "獎項",
				"certificates": "證書",
				"interests": "興趣",
				"languages": "語言",
				"projects": "項目",
				"publications": "出版物和講座",
				"references": "推薦信",
				"skills": "技能",
				"volunteering": "志願服務",
				"experience": "經歷",
				"present": "目前",
				"highlights": "亮點",
				"score": "平均績點" 
			}
		}
	},
	lng: "en"
});

Handlebars.registerHelper('formatDate', function(dateString) {
	let dateStrArr = dateString.split('-');

	if (dateStrArr[0] && dateStrArr[1] && dateStrArr[2])
		return new Date(dateString).toLocaleDateString(locale, {
			month: 'short',
			year: 'numeric',
			day: 'numeric',
		});

	if (dateStrArr[0] && dateStrArr[1])
		return new Date(dateString).toLocaleDateString(locale, {
			month: 'short',
			year: 'numeric',
		});

	return dateStrArr;
})


Handlebars.registerHelper('i18n', function(phrase) {
	return i18next.t(phrase);
})

function render(resume) {
	i18next.changeLanguage(locale);
	var css = fs.readFileSync(__dirname + "/style.css", "utf-8");
	var tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");
	var partialsDir = path.join(__dirname, 'partials');
	var filenames = fs.readdirSync(partialsDir);

	filenames.forEach(function(filename) {
		var matches = /^([^.]+).hbs$/.exec(filename);
		if (!matches) {
			return;
		}
		var name = matches[1];
		var filepath = path.join(partialsDir, filename)
		var template = fs.readFileSync(filepath, 'utf8');

		Handlebars.registerPartial(name, template);
	});
	return Handlebars.compile(tpl)({
		css: css,
		resume: resume
	});
}

module.exports = {
	render: render
};

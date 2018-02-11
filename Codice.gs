/**
 * Retrieve the birthdays in a range and return them in two lists, one for today's and one for the rest of the period
 *
 * @name getBirthdays
 * @function
 * @param {number} days - number of days to add to today to get the date range (optional)
 * @returns {object} object with following properties 'today' with today's birthdays 'remaining' with the remaingin birthdays for the date range
 */
function getBirthdays(days) {
  var result = {
      'today': []
  };
  var _tmpNow = new Date();
  // Preparo un oggetto per avere a disposizione le parti della data odierna che mi serviranno
  var now = {
      'year': _tmpNow.getFullYear(),
      'month': _tmpNow.getMonth(),
      'day': _tmpNow.getDate()
  };
  var start = new Date(now.year, now.month, now.day, 0, 0, 0, 0);
  var end = new Date(now.year, now.month, now.day + days, 23, 59, 59, 999);
  // Recupero i compleanni tra oggi e "days" giorni da oggi
  var contactsBirthdays=CalendarApp
    .getCalendarById('#contacts@group.v.calendar.google.com')
    .getEvents(start, end);
  // Per ogni compleanno controllo quanti siano in data odierna e li sposto
  // in result.today
  contactsBirthdays.forEach(function(bday) {
    if(bday.getAllDayStartDate().getDate() === now.day){
        result.today.push(contactsBirthdays.shift())
    }
  });
  // Assegno i restanti compleanni a result.remaining
  result.remaining = contactsBirthdays;
  return result;
}

/**
 * Send an HTML email with a list of birthdays
 *
 * @name sendTodaysBirthday
 * @function
 */
function sendTodaysBirthday() {
  // Creo un template HTML a partire dal file 'Email.html'
  var emailTemplate = HtmlService
      .createTemplateFromFile('Email');
  // assegno alla proprità 'birthdays' quanto viene restituito dalla funzione getBirthdays(7)
  emailTemplate.birthdays = getBirthdays(7);
  // Genero l'HTML a partire dal template e i dati che gli ho precedentemente passato
  var email = emailTemplate.evaluate();
  // Invio una mail a me stesso con oggetto 'Promemoria' e come corpo l'HTML precedentemente generato
  MailApp.sendEmail(Session.getActiveUser().getEmail(), "Promemoria", "", {"htmlBody" : email.getContent()});
}

/**
 * Include the partial HTML of a specific file
 *
 * @name include
 * @function
 * @param {string} filename - name of the file to get the HTML from
 * @returns {string} partial HTML
 */
function include(filename) {
    return HtmlService
        .createHtmlOutputFromFile(filename)
        .getContent();
}

/**
 * Format nicely the date
 *
 * @name niceDate
 * @function
 * @param {date} date - the date object to format
 * @returns {string} nicely formatted date
 */
function niceDate(date) {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('it-IT', options);
}

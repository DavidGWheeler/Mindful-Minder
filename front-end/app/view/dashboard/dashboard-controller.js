'use strict';

// require('./_dashboard.scss');

module.exports = [
  '$log',
  'minderService',
  function($log, minderService) {
    this.$oninit = () => {
      $log.debug('Dashboard Controller');

      this.title = 'Create a reminder on the calendar';

      this.minders = [];

      this.fetchMinders = () => {
        return minderService.fetchMinders()
          .then(minders => {
            this.minders = minders;
            this.currentMinder = this.minder[0];
          })
          .catch(err => $log.error(err));
      };
      this.fetchMinders();
    };
  },
];

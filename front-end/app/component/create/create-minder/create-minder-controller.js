'use strict';

require('./_create-minder.scss');

module.exports = {
  template: require('./create-minder.html'),
  controllerAs: 'createMinderCtrl',
  controller: ['$log', '$rootScope','twilio', 'minderService', '$location', function($log, $rootScope, minderService, $location) {

    this.$onInit = () => {
      $log.debug('CreateMinderController');
      this.minder = {};
      this.minderData = {
        name: null,
        phNum: null,
        id: null,
      };
    };

    this.createMinder = () => {
      this.minder.location = null;
      this.minder.location = this.minderData;
      return minderService.createMinder(this.minder)
        .then(() => {
          let res = this.minder;
          this.minder.title = null;
          this.minder.date = null;
          this.minder.description = null;

          $rootScope.$emit('newMinderCreated');
          return res;
        })
        .then(() => $location.url('/dashboard'))
        .catch(err => $log.error(err));
    };
  },
  ],
};

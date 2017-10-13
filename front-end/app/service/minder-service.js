'use strict';

module.exports = [
  '$q',
  '$log',
  '$http',
  'authService',
  'Upload',
  function($q, $log, $http, authService, Upload) {
    $log.debug('Minder Service');

    let service = {};

    service.minders = [];
    service.indvMinders = [];
    service.allMinders = [];

    service.createMinder = minder => {
      $log.debug('service.createMinder');

      return authService.getToken()
      .then(token => {
        let url = '${__API_URL__}/api/minder';
        let headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        return Upload.upload({
          url,
          headers,
          method: 'POST',
          data: minder,
        });
      })
      .then(res => {
        $log.log('Reminder created successfully');
        service.minders.unshift(res.data);
        return res.data;
      })
      .catch(err => {
        $log.error(err.message);
        return $q.reject(err);
      });
    };
    service.fetchMinders = () => {
      $log.debug('service.fetchMinders');

      return authService.getToken()
        .then(token => {
          let config = {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          };
          return $http.get(`{__API_URL__}/api/minder`, config);
        })
        .then(res => {
          $log.log('Reminder retrieved');
          service.minders = res.data;
          return res.data;
        })
        .catch(err => {
          $log.error(err.message);
          $q.reject(err);
        });
    };
    service.fetchallMinders = () => {
      $log.debug('service.fetchallMinders');

      return authService.getToken()
      .then(token => {
        let config = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };

        return $http.get(`${__API_URL__}/api/calendar`, config);
      })
        .then(res => {
          $log.log('All Reminders retrieved');
          service.allMinders = res.data;
          return res.data;
        })
        .catch(err => {
          $log.error(err.message);
          $q.reject(err);
        });
    };
    
    service.updateMinder = (minder, minderId) => {
      $log.debug('service.updateMinder');

      return authService.getToken()
        .then(token => {
          let headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          };
          return Upload.upload({
            url,
            headers,
            method: 'Put',
            data: minder,
          });
        })
        .then(res => {
          service.minders.forEach((ele, idx) => {
            if(ele._id === res.data._id) service.minders[idx] = res.data;
          });
          return res.data;
        })
        .catch(err => {
          $log.error(err.message);
          return $q.reject(err);
        });
    };
    service.deleteMinder = (minderId) => {
      $log.debug('service.deleteMinder');

      return authService.getToken()
        .then(token => {
          let url = `${__API_URL__}/api/minder/${minderId}`;

          let config = {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          };
          return $http.delete(url, config);
        })
        .then(
          res => {
            service.minders.filter((ele, idx) => {
              if(ele._id === minderId) {
                service.minders.splice(idx, 1);
              }
            });

            return res.data;
          },
          err => {
            $log.error(err.message);
            return $q.reject(err);
          }
        );
    };

    return service;
  },
];

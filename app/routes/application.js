import Ember from 'ember';

const issueQuery = /^([^\/]+)\/([^\/]+)#(\d+)$/;
const repoQuery = /^([^\/]+)\/([^\/]+)$/;

export default Ember.Route.extend({
  model() {
    return Ember.Object.create({
      ghurl: 'https://github.com/',
      query: '',
      isLoading: true
    });
  },

  actions: {
    loading() {
      this.modelFor('application').set('isLoading', true);
    },

    jumpTo(query) {
      let m;

      if (m = issueQuery.exec(query)) {
        this.transitionTo('user.repo.issue', m[1], m[2], m[3]);
      } else if (m = repoQuery.exec(query)) {
        this.transitionTo('user.repo', m[1], m[2]);
      } else {
        this.transitionTo('user', query);
      }
    },

    didTransition() {
      let ghurl = 'https://github.com/';
      let query = '';

      if (this.router.isActive('user')) {
        let user = this.modelFor('user').login;

        ghurl += `${user}/`;
        query += `${user}`;
      }

      if (this.router.isActive('user.repo')) {
        let repo = this.modelFor('user.repo').name;

        ghurl += `${repo}/`;
        query += `/${repo}`;
      }

      if (this.router.isActive('user.repo.issue')) {
        let issue = this.modelFor('user.repo.issue').number;

        ghurl += `issues/${issue}/`;
        query += `#${issue}`;
      }

      this.modelFor('application').setProperties({ ghurl, query, isLoading: false });
    }
  }
});
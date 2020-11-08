export default class GitHubApi {
  static _baseUri = '//api.github.com';

  static getRepositories(inParameters) {
    let parameters = Object.assign({
      q: '',
      sort: 'stars',
      order: 'desc'
    }, inParameters);

    let url = `${this._baseUri}/search/repositories?${this._parametersToString(parameters)}`;


    return fetch(url)
      .then(response => response.json())
      .catch(error => {
        console.log(error);
      })
  }

  static _parametersToString(parameters) {
    return Object.entries(parameters)
      .map(pair => pair.join('='))
      .join('&');
  }
}
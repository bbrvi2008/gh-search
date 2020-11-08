import 'normalize.css';
import '../scss/style.scss';

import Utils from './Utils';
import GitHubApi from './GitHubApi';
import Dropdown from './Dropdown';
import DataTable from './DataTable'
import EventEmitter from './EventEmitter';

let ApplicationEvents = {
  searchValueChanged: 'event:search-value-changed',
  repositorySelected: 'event:repository-selected',
  repositoriesLoaded: 'event:repositories-loaded',
  removingRepository: 'event:removing-repository'
};

class Application {
  constructor() {
    this.data = [];
    this.eventEmitter = new EventEmitter();

    let $elSearch = document.querySelector('.dropdown');
    this.searchInput = this._buildSearchInput($elSearch);
    this._bindSearchInputHandlers();

    let $repositoriesContainer = document.querySelector('.repositories');
    this.repositoriesTable = this._buildRepositoriesTable($repositoriesContainer);
    this._bindRepositoriesTableHandlers();
  }

  _buildSearchInput($element) {
    return new Dropdown($element, {
      onChangedValue: searchValue => {
        this.eventEmitter.emit(ApplicationEvents.searchValueChanged, searchValue);
      },
      onSelectedItem: selectedRepository => {
        this.eventEmitter.emit(ApplicationEvents.repositorySelected, selectedRepository);
      }
    });
  }

  _bindSearchInputHandlers() {
    this.eventEmitter.on(ApplicationEvents.searchValueChanged, Utils.debounce(this._handleSearchValueChanged, 500));
    this.eventEmitter.on(ApplicationEvents.repositoriesLoaded, this._handleRepositoriesLoaded);
  }

  _handleSearchValueChanged = (searchValue) => {
    GitHubApi.getRepositories({
      q: searchValue,
      per_page: 5
    }).then(json => {
      if(json == null) return [];

      return json.items.map(repository => {
        let {
          id,
          name,
          full_name,
          stargazers_count: stars,
          owner
        } = repository;

        return {
          id,
          name,
          full_name,
          stars,
          owner: owner.login
        };
      });
    }).then(repositories => {
      this.eventEmitter.emit(ApplicationEvents.repositoriesLoaded, repositories);
    });
  }

  _handleRepositoriesLoaded = (repositories) => {
    let items = repositories.map(repository => {
      return {
        value: repository.full_name,
        ...repository 
      };
    })

    this.searchInput.updateItems(items);
  }

  _buildRepositoriesTable($container) {
    return new DataTable($container, {
      columns: [{
        name: 'name',
        title: 'Name'
      }, {
        name: 'owner',
        title: 'Owner'
      }, {
        name: 'stars',
        title: 'Stars'
      }],
      data: this.data,
      removableRows: true,
      onRemovedRow: data => {
        this.eventEmitter.emit(ApplicationEvents.removingRepository, data);
      }
    });
  }

  _bindRepositoriesTableHandlers() {
    this.eventEmitter.on(ApplicationEvents.repositorySelected, this._handleRepositorySelected);
    this.eventEmitter.on(ApplicationEvents.removingRepository, this._handleRemovingRepository);
  }

  _handleRepositorySelected = (repositorySelected) => {
    this.data.push(repositorySelected);
    this.repositoriesTable.rebuildTable(this.data);
  }

  _handleRemovingRepository = (data) => {
    this.data = this.data.filter(row => {
      return row.id != data.id;
    });

    this.repositoriesTable.rebuildTable(this.data);
  }
}

let application = new Application();


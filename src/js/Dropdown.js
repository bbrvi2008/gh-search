export default class Dropdown {
  constructor($container, options = {}) {
    this.$container = $container;
    this.$input = $container.querySelector('input');
    this.$list = $container.querySelector('.dropdown__list');
    this.items = [];

    let { onChangedValue, onSelectedItem } = options;

    this.onChangedValue = onChangedValue || (() => {});
    this.onSelectedItem = onSelectedItem || (() => {});

    this._init();
  }

  updateItems(items) {
    this.items = items;
    this._renderListItems();    
  }

  handleEvent = (event) => {
    let isInput = event.target == this.$input;
    let isListItem = event.target.classList.contains('dropdown__list-item');

    switch(event.type) {
      case 'keydown':
        let value = this.$input.value;
        this.onChangedValue(value);
        break;
      case 'click':
        if(isInput) this.handleInputClick(event.target);
        if(isListItem) this.handleListItemClick(event.target);
        break;
      case 'change':
        if(isInput) {
          console.log(this.$input.value);
        }
        break;
    }
  }

  handleInputClick($el) {

  }

  handleListItemClick($el) {
    let id = $el.dataset.id;
    let selectedItem = this.items.find(item => {
      return item.id == id;
    });
    
    this.onSelectedItem(selectedItem);
    this._reset();
  }

  _init() {
    this.$container.addEventListener('keydown', this.handleEvent);
    this.$container.addEventListener('change', this.handleEvent);
    this.$container.addEventListener('click', this.handleEvent);
    this._renderListItems();    
  }

  _reset() {
    this.items = [];
    this.$input.value = '';
    this.$list.textContent = '';
    this.$list.hidden = true;
  }

  _renderListItems() {
    if(this.items.length === 0) return;
    
    let $list = this.$list;
    let $listItems = this._buildListItems(this.items);

    $list.textContent = '';
    $listItems.forEach($listItem => {
      $list.append($listItem);
    });
    $list.hidden = false;
  }

  _buildListItems(items) {
    return items.map(this._buildListItem);
  }

  _buildListItem(item) {
    let { id, value } = item;

    let $listItem = document.createElement('li');
    $listItem.classList.add('dropdown__list-item');
    $listItem.dataset.id = id;
    $listItem.textContent = value;

    return $listItem;
  }
}
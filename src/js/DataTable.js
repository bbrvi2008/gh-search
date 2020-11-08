class TableBuilder {
  static buildCell(content, title) {
    let cell = document.createElement('td');
    cell.classList.add('responsive-table__cell');
    if(title) {
      cell.dataset.title = title;
    }

    cell.append(content);

    return cell;
  }

  static buildTextCell(value, title) {
    let text = document.createElement('span');
    text.classList.add('responsive-table__cell-text');
    text.textContent = value;

    return this.buildCell(text, title);
  }

  static buildButtonCell(iconClass) {
    let icon = document.createElement('div');
    icon.classList.add('button__icon', 'button__icon--border', 'icon', iconClass);
    
    let button = document.createElement('button');
    button.classList.add('button');
    button.setAttribute('type', 'button');
    button.append(icon);

    let cell = this.buildCell(button);
    cell.classList.add('responsive-table__button');
    return cell;
  }

  static buildRow(cells) {
    let row = document.createElement('tr');
    row.classList.add('responsive-table__row');

    cells.forEach(cell => {
      row.append(cell);
    });

    return row;
  }

  static buildBody(rows) {
    let body = document.createElement('tbody');
    body.classList.add('responsive-table__tbody');

    rows.forEach(row => {
      body.append(row);
    });

    return body;
  }

  static buildHeaderCell(value) {
    let cell = document.createElement('th');
    cell.classList.add('responsive-table__header-cell');
    cell.textContent = value;

    return cell;
  }

  static buildHeaderRow(cells) {
    let row = document.createElement('tr');
    row.classList.add('responsive-table__header');

    cells.forEach(cell => {
      row.append(cell);
    });

    return row;
  }

  static buildHeader(row) {
    let header = document.createElement('thead');
    header.classList.add('responsive-table__thead');
    header.append(row);

    return header;
  }

  static buildTable() {
    let table = document.createElement('table');
    table.classList.add('responsive-table');

    return table;
  }
}

export default class DataTable {
  constructor($container, {columns, data = [], ...options}) {
    this.columns = columns;
    let $table = this._buildTable(columns, data, options);

    this.$container = $container;
    this.$container.append($table);

    this.rebuildTable = this._createRebuildTableFunction(columns, options);
  }

  _createRebuildTableFunction(columns, options) {
    return (data) => {
      let rows = this._buildRows(data, columns, options);

      this.body.textContent = '';
      rows.forEach(row => {
        this.body.append(row);
      });
    }
  }

  _buildTable(columns, data, options) {
    this.headerRow = this._buildHeaderRow(columns, options);
    
    let rows = this._buildRows(data, columns, options);
    
    let header = TableBuilder.buildHeader(this.headerRow);
    this.body = TableBuilder.buildBody(rows);


    let table = TableBuilder.buildTable();
    table.append(header);
    table.append(this.body);
    
    return table;
  }

  _getCountColumns(columns, { removableRows }) {
    let count = columns.length;

    if(removableRows) {
      ++count;
    }

    return count;
  }

  _buildHeaderRow(columns, options) {
    let cells = columns.map(({title}) => {
      return TableBuilder.buildHeaderCell(title);
    })
    .concat(this._buildAdditionalHeaderCells(options));
    
    return TableBuilder.buildHeaderRow(cells);
  }

  _buildRows(data, columns, options) {
    let countColumns = this._getCountColumns(columns, options);

    if(data && data.length > 0) {
      return this._buildDataRows(data, columns, options);
    }

    return [this._buildEmptyRow(countColumns)];
  }

  _buildEmptyRow(countColumns) {
    let cell = TableBuilder.buildTextCell('Данные отсутствуют');
    cell.setAttribute('colspan', countColumns);

    return TableBuilder.buildRow([cell]);
  }

  _buildDataRows(data, columns, options) {
    let rows = data.map(row => {
      return this._buildDataRow(row, columns, options);
    });

    return rows;
  }

  _buildDataRow(data, columns, options) {
    let rowCells = columns.map(({ name, title }) => {
      return TableBuilder.buildCell(data[name], title);
    })
    .concat(this._buildAdditionalDataCells(data, options));

    return TableBuilder.buildRow(rowCells);
  }

  _buildAdditionalHeaderCells({ removableRows }) {
    let cells = [];

    if(removableRows) {
      cells.push(TableBuilder.buildHeaderCell(''))
    }

    return cells;
  }

  _buildAdditionalDataCells(data, { removableRows, onRemovedRow }) {
    let cells = [];

    if(removableRows) {
      let removeButtonCell = TableBuilder.buildButtonCell('icon--close');

      removeButtonCell.addEventListener('click', () => {
        onRemovedRow(data);
      })

      cells.push(removeButtonCell);
    }

    return cells;
  }
}



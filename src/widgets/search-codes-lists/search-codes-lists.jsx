import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { StatisticalContextCriteria } from 'widgets/statistical-context-criteria';
import ReactModal from 'react-modal';
import SearchResults from 'widgets/search-results/components/search-results';
import { WIDGET_SEARCH_CODES_LISTS, WIDGET_INPUT_FILTER_WITH_CRITERIA } from 'constants/dom-constants';
import {
  DEFAULT_FORM_NAME,
  SEARCH_RESULTS_COLUMNS,
} from 'constants/pogues-constants';
import Dictionary from 'utils/dictionary/dictionary';
import { searchCodesLists } from "utils/remote-api"

const {
  COMPONENT_CLASS,
  SEARCH_RESULTS_CLASS,
  SEARCH_CLASS,
} = WIDGET_SEARCH_CODES_LISTS;


function SearchCodesLists({ path }) {
  const [searchValue, setSearchValue] = useState('')
  const [codesLists, setCodesLists] = useState([])
  const [pendingSearch, setPendingSearch] = useState(false)
  const [selectedCodesList, setSelectedCodesList] = useState(null)

  useEffect(() => {
    // TODO LOIC changer quand le back fera le proxy
    if (pendingSearch && searchValue) {
      searchCodesLists(searchValue).then(response => {
        setCodesLists(response)
      })
    }
    setPendingSearch(false)
  }, [pendingSearch, searchValue])

  const propsStatisticaContextCriteria = {
    formName: DEFAULT_FORM_NAME,
    path,
    showOperations: false,
    showCampaigns: false,
    horizontal: true,
  };
  const propsSearchResults = {
    className: SEARCH_RESULTS_CLASS,
    noValuesMessage: Dictionary.codesListsNoResults,
    columns: SEARCH_RESULTS_COLUMNS.CODES_LIST,
    actions: [
      {
        dictionary: 'searchResultActionReuse',
        action: (values) => {
          setSelectedCodesList(values)
        },
        iconOnly: true,
        icon: 'glyphicon-eye-open',
      },
      {
        dictionary: 'searchResultActionReuse',
        action: (values) => {
          alert('test')
        },
        iconOnly: true,
        icon: 'glyphicon-tags',
      },
    ],
    values: codesLists
  };
  return (
    <div className={COMPONENT_CLASS}>
      <div className={SEARCH_CLASS}>
        <StatisticalContextCriteria {...propsStatisticaContextCriteria} />
        <div className={WIDGET_INPUT_FILTER_WITH_CRITERIA.COMPONENT_CLASS}>
          <div className={WIDGET_INPUT_FILTER_WITH_CRITERIA.PANEL_INPUT_CLASS}>
            <label for="codes-lists-search">{Dictionary.searchInputCodesListsLabel}</label>
            <div> <input
              id="codes-lists-search"
              className={WIDGET_INPUT_FILTER_WITH_CRITERIA.SEARCH_INPUT_CLASS}
              type="text"
              placeholder={Dictionary.searchInputCodesListsLabel}
              onChange={e => setSearchValue(e.target.value)}
            /></div>
          </div>
          <button
            className={WIDGET_INPUT_FILTER_WITH_CRITERIA.BUTTON_SEARCH_CLASS}
            onClick={() => setPendingSearch(true)}
          >
            {Dictionary.searchInputButton}
          </button>
        </div>
      </div>
      <SearchResults {...propsSearchResults} />
      <ReactModal
        isOpen={selectedCodesList}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={false}
      >
        <div>{selectedCodesList?.description}</div>
        <ul>{
          selectedCodesList?.modalities.map((modality, index) => <li key={index}>{modality}</li>)
        }</ul>
        <button onClick={() => setSelectedCodesList(null)}>close</button>
      </ReactModal>
    </div>
  );
}

SearchCodesLists.propTypes = {
  path: PropTypes.string,
};

SearchCodesLists.defaultProps = {
  path: '',
};

export default SearchCodesLists;

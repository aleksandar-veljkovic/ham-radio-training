import './App.css'
import PrimaryPrefixQuiz from './components/primaryPrefixQuiz'
import PrimaryPrefixQuizReversed from './components/primaryPrefixQuizReversed'


import data from './assets/countryCodes';
import bandData from './assets/bands';
import { useEffect, useState } from 'react';
import { Button, ButtonGroup } from '@mui/material';
import Spelling from './components/spelling';
import Bands from './components/bands';
import BandsReversed from './components/bandsReversed';

function App() {
  const [filteredData, setFilteredData] = useState(data);
  const [selectedGroups, setSelectedGroups] = useState([0, 1, 2, 3, 4, 5, 6]);

  const availableGroups = [];
  for (let i = 0; i < Math.ceil(data.length / 10); i += 1) {
    availableGroups.push(i);
  }

  const primaryPrefixMap = filteredData.reduce((prev, curr) => {
    prev[curr['primaryPrefix']] = curr.dxcc;
    return prev;
  }, {});

  useEffect(() => {
    setFilteredData(data.filter((el, index) => selectedGroups.includes(Math.floor(index / 10))));
  }, [selectedGroups])

  return (
    <>
      <p>Select question set</p>
      <ButtonGroup size="small" aria-label="Small button group">
      {
        availableGroups.map(groupNumber => (
            selectedGroups.includes(groupNumber) ?
              <Button variant='contained' onClick={() => setSelectedGroups(selectedGroups.filter(el => el != groupNumber))}>Set {groupNumber + 1}</Button>
              :
              <Button variant='outlined' onClick={() => setSelectedGroups([...selectedGroups, groupNumber])}>Set {groupNumber + 1}</Button>
        ))
      }
      </ButtonGroup>
      <p>Prefix to DXCC</p>
      <PrimaryPrefixQuiz data={filteredData} primaryPrefixMap={primaryPrefixMap}/>
      <br></br>
      <p>DXCC to Prefix</p>
      <PrimaryPrefixQuizReversed data={filteredData} primaryPrefixMap={primaryPrefixMap}/>
      <p>Spelling</p>
      <Spelling data={filteredData} primaryPrefixMap={primaryPrefixMap}/>
      <p>Wavelength to Frequency</p>
      <Bands data={bandData}/>
      <p>Frequency to Wavelength</p>
      <BandsReversed data={bandData}/>
    </>
  )
}

export default App

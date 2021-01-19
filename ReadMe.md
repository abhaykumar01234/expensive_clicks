# Get Expensive Clicks

## Steps to run

- Clone the repository and cd into the root folder
- run _npm install_
- run _npm run solution_ to run the program
- run _npm run test_ to run the testcases

## Dev Dependencies

- **Jasmine** [_v3.5.0_]

### Jasmine

Jasmine is used for runing test cases for the javascript code of solution.

## Input

This program takes an array of json objects as input where each object is of the format.

    [
      { "ip": "44.44.44.44", "timestamp": "3/11/2016 06:32:42", "amount": 5.0 },
      { "ip": "22.22.22.22", "timestamp": "3/11/2016 06:35:12", "amount": 2.0 },
        ......
    ]

## Requirements

Given an array of clicks, return the subset of clicks where:

1. For each IP within each one hour period, only the most expensive click is placed into the result set.
2. If more than one click from the same IP ties for the most expensive click in a one hour period, only place the earliest click into the result set.
3. If there are more than 10 clicks for an IP in the overall array of clicks, do not include any of those clicks in the result set.
   The result set should be stored in an array of hashes. Each hash should represent a click. The expected result set should be a subset of the original array.

## Approach

### Step1 - Grouping and Creating Intermediate Output

    {
      '22.22.22.22': {
          '10': [ 5 ],
          '11': [ 10 ],
          '13': [ 6 ],
          '16': [ 8 ],
          '23': [ 9 ],
          '02': [ 7 ],
          '05': [ 11 ],
          '06': [ 2 ],
          '07': [ 1, 12 ],
          '08': [ 3 ],
          '09': [ 4 ]
       },
       '11.11.11.11': {
           '02': [ 6.5, 7.25 ],
           '06': [ 12, 11.75 ],
           '07': [ 4.5 ]
       },
       '44.44.44.44': {
    	   '13': [ 8 ],
    	   '02': [ 8.75 ],
    	   '06': [ 5 ]
    	},
       '33.33.33.33': { '07': [ 15.75 ] },
       '66.66.66.66': { '07': [ 14.25 ] },
       '55.55.55.55': {
    	   '13': [ 8, 8, 8, 6.25 ],
           '14': [ 4.25, 5.25 ],
           '15': [ 6.25 ],
           '16': [ 8.5 ],
           '17': [ 11.25 ],
           '18': [ 9 ]
      }
    }

### Step2 - Taking highest amount/ lowest timestamp record and filtering IPs with click count more than 10

    11.11.11.11 {
      '02': { ip: '11.11.11.11', timestamp: '3/11/2016 02:13:11', amount: 7.25 },
      '06': { ip: '11.11.11.11', timestamp: '3/11/2016 06:45:01', amount: 12 },
      '07': { ip: '11.11.11.11', timestamp: '3/11/2016 07:02:54', amount: 4.5 }
    }
    44.44.44.44 {
      '13': { ip: '44.44.44.44', timestamp: '3/11/2016 13:02:55', amount: 8 },
      '02': { ip: '44.44.44.44', timestamp: '3/11/2016 02:13:54', amount: 8.75 },
      '06': { ip: '44.44.44.44', timestamp: '3/11/2016 06:32:42', amount: 5 }
    }
    33.33.33.33 {
      '07': { ip: '33.33.33.33', timestamp: '3/11/2016 07:02:54', amount: 15.75 }
    }
    66.66.66.66 {
      '07': { ip: '66.66.66.66', timestamp: '3/11/2016 07:02:54', amount: 14.25 }
    }
    55.55.55.55 {
      '13': { ip: '55.55.55.55', timestamp: '3/11/2016 13:02:40', amount: 8 },
      '14': { ip: '55.55.55.55', timestamp: '3/11/2016 14:03:04', amount: 5.25 },
      '15': { ip: '55.55.55.55', timestamp: '3/11/2016 15:12:55', amount: 6.25 },
      '16': { ip: '55.55.55.55', timestamp: '3/11/2016 16:22:11', amount: 8.5 },
      '17': { ip: '55.55.55.55', timestamp: '3/11/2016 17:18:19', amount: 11.25 },
      '18': { ip: '55.55.55.55', timestamp: '3/11/2016 18:19:20', amount: 9 }
    }

### Step3 - Create resultJson using the intermediate result

    [
      { ip: '11.11.11.11', timestamp: '3/11/2016 02:13:11', amount: 7.25 },
      { ip: '11.11.11.11', timestamp: '3/11/2016 06:45:01', amount: 12 },
      { ip: '11.11.11.11', timestamp: '3/11/2016 07:02:54', amount: 4.5 },
      { ip: '44.44.44.44', timestamp: '3/11/2016 13:02:55', amount: 8 },
      { ip: '44.44.44.44', timestamp: '3/11/2016 02:13:54', amount: 8.75 },
      { ip: '44.44.44.44', timestamp: '3/11/2016 06:32:42', amount: 5 },
      { ip: '33.33.33.33', timestamp: '3/11/2016 07:02:54', amount: 15.75 },
      { ip: '66.66.66.66', timestamp: '3/11/2016 07:02:54', amount: 14.25 },
      { ip: '55.55.55.55', timestamp: '3/11/2016 13:02:40', amount: 8 },
      { ip: '55.55.55.55', timestamp: '3/11/2016 14:03:04', amount: 5.25 },
      { ip: '55.55.55.55', timestamp: '3/11/2016 15:12:55', amount: 6.25 },
      { ip: '55.55.55.55', timestamp: '3/11/2016 16:22:11', amount: 8.5 },
      { ip: '55.55.55.55', timestamp: '3/11/2016 17:18:19', amount: 11.25 },
      { ip: '55.55.55.55', timestamp: '3/11/2016 18:19:20', amount: 9 }
    ]

## Algorithm Logic & Complexity

There are 2 functions namely:

1.  **iterateClicks(arr)** : Takes the input array, checks if all required keys are present, calculates the valid period to which the timestamp belongs to, and calls the next function **_processClick_** to process with all params. _Complexity O(n)_ . Once the results are obtained in intermediate object, it parses the object to obtain the desired formatted result, excluding the IP address with click count greater than 10.

2.  **processClick(obj, period, ip, timestamp, amount)** : Performs the main logic fulfulling all the conditions in requirement and adds records groupwise for each IP each valid one hour period to the intermediate result object _Complexity O(n)_

## Output

The output is printed in console as well as stored in the output folder in a file named **_resultset.json_**

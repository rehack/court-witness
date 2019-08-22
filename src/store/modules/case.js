import { queryCaseNo } from '@/api/case';

const caseModules = {
    state: {
        lawCaseId: ''
    },
    mutations: {
        SET_DATA: (state, data) => {
            state.data = data;
        },
        SET_NAME: (state, lawCaseId) => {
            state.lawCaseId = lawCaseId;
        }
    },
    actions: {
        searchCaseNo({ commit }, caseNo) {
          return new Promise((resolve, reject) => {
              queryCaseNo(caseNo)
                  .then(response => {
                      console.log(response);
                      resolve(response);
                  })
                  .catch(error => {
                      reject(error);
                  });
          });
        }
    }
};

export default caseModules;

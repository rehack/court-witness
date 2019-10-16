import { queryCaseNo } from '@/api/case';

const caseModules = {
    actions: {
        searchCaseNo ({ commit }, caseNo) {
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

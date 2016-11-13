export default function tableUtilProvider(){


        this.$get = function(){
            return  {
                getRows: getRows,
                getHeaderRows: getHeaderRows,
                getBodyRows: getBodyRows,
                getColumnCount:getColumnCount,
                Hash:Hash,
                purgeUnit:purgeUnit,
            }
        }

        function purgeUnit(word){
            return parseInt(word.replace(/[px]?[em]?/g,''));
        }
        //table
        function getRows(element){
            return Array.prototype.filter.call(element.rows, function (row) {
                return !row.classList.contains('ng-leave');
            });
        }

        function  getHeaderRows(tableElement){
            return this.getRows(tableElement.tHead);
        }

        function getColumnCount(tableElement) {
            return this.getRows(tableElement).reduce(function (count, row) {
                return row.cells.length > count ? row.cells.length : count;
            }, 0);
        };

        function getBodyRows(tableElement) {
            return Array.prototype.reduce.call(tableElement.tBodies, (result, tbody) =>{
                return result.concat(this.getRows(tbody));
            }, []);
        };

    };


function Hash() {
    var keys = {};
    this.equals = function (key, item) {
        return keys[key] === item;
    };
    this.get = function (key) {
        return keys[key];
    };
    this.has = function (key) {
        return keys.hasOwnProperty(key);
    };
    this.purge = function (key) {
        delete keys[key];
    };
    this.update = function (key, item) {
        keys[key] = item;
    };
}

<template>
 <div class="page-container">
  <Table :columns="columns11" :data="tableData" border></Table>
 </div>
</template>

<script>
import TableRectangle from './rectangle'
import ExpandRow from './expand-row'
const rectangleThWidth = 150
export default {
  name: 'cas-dashboard',
  data () {
    return {
      rectangleThWidth,
      columns11: [
        {
            type: 'expand',
            width: 35,
            fixed: 'left',
            render: (h, params) => {
                return h(ExpandRow, {
                    props: {
                        width: rectangleThWidth,
                        row: params.row
                    }
                })
            }
        },

          {
            key: 'name',
            width: rectangleThWidth,
            fixed: 'left',
            align: 'center',
            className: 'rectangle-th',
            renderHeader: (h, params)=>{
              return h(TableRectangle)
            }
          },
           {
                title: '每日优鲜',
                align: 'center',
                children: [
                {
                    title: '每日优鲜',
                    align: 'center',
                    children: [
                        {
                            title: '绝对值',
                            align: 'center',
                            key:'tets'
                        },
                        {
                            title: '单均',
                            align: 'center',
                            key:'tets'
                        }
                    ]
                },
                {
                    title: '主商城',
                    align: 'center',
                    children: [
                        {
                            title: '绝对值',
                            align: 'center',
                            key:'tets'
                        },
                        {
                            title: '单均',
                            align: 'center',
                            key:'tets'
                        }
                    ]
                },
                {
                    title: '平台',
                    align: 'center',
                    children: [
                        {
                            title: '绝对值',
                            align: 'center',
                            key:'tets'
                        },
                        {
                            title: '单均',
                            align: 'center',
                            key:'tets'
                        }
                    ]
                },
                {
                    title: '猩猩微仓',
                    align: 'center',
                    children: [
                        {
                            title: '绝对值',
                            align: 'center',
                            key:'tets'
                        },
                        {
                            title: '单均',
                            align: 'center',
                            key:'tets'
                        }
                    ]
                },
                {
                    title: '猴子微仓',
                    children: [
                        {
                            title: '绝对值',
                            align: 'center',
                            key:'tets'
                        },
                        {
                            title: '单均',
                            align: 'center',
                            key:'tets'
                        }
                    ]
                },
                {
                    title: '优鲜超市',
                    align: 'center',
                    children: [
                        {
                            title: '绝对值',
                            align: 'center',
                            key:'tets'
                        },
                        {
                            title: '单均',
                            align: 'center',
                            key:'tets'
                        }
                    ]
                }
                ]
            },
          {
              title: '外单-便利购',
                align: 'center',
              children: [
                    {
                        title: '外单-便利购',
                        align: 'center',
                        children: [
                            {
                                title: '绝对值',
                                align: 'center',
                                key:'tets'
                            },
                            {
                                title: '单均',
                                align: 'center',
                                key:'tets'
                            }
                        ]
                    }
                ]
          }
      ],
      tableData: [{
        name: 'John Brown',
        age: 18,
        address: 'New York No. 1 Lake Park',
        job: 'Data engineer',
        interest: 'badminton',
        birthday: '1991-05-14',
        book: 'Steve Jobs',
        movie: 'The Prestige',
        music: 'I Cry'
    },
    {
        name: 'Jim Green',
        age: 25,
        address: 'London No. 1 Lake Park',
        job: 'Data Scientist',
        interest: 'volleyball',
        birthday: '1989-03-18',
        book: 'My Struggle',
        movie: 'Roman Holiday',
        music: 'My Heart Will Go On'
    },
    {
        name: 'Joe Black',
        age: 30,
        address: 'Sydney No. 1 Lake Park',
        job: 'Data Product Manager',
        interest: 'tennis',
        birthday: '1992-01-31',
        book: 'Win',
        movie: 'Jobs',
        music: 'Don’t Cry'
    },
    {
        name: 'Jon Snow',
        age: 26,
        address: 'Ottawa No. 2 Lake Park',
        job: 'Data Analyst',
        interest: 'snooker',
        birthday: '1988-7-25',
        book: 'A Dream in Red Mansions',
        movie: 'A Chinese Ghost Story',
        music: 'actor'
    }
 
      ]
    }
  },
  components: {
    TableRectangle,
    ExpandRow
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.page-container {
}

/deep/.ivu-table {
    th {
        height: 30px;
        font-weight: normal;
    }
}

/deep/.ivu-table-header, /deep/.ivu-table-fixed-header {
    .rectangle-th {
        .ivu-table-cell {
            padding: 0 !important;
            width: 100%;
            height: 100%;
        }
    }
    
}

/deep/.ivu-table-expanded-cell {
    padding: 0;
    padding-left: 30px;
}
</style>


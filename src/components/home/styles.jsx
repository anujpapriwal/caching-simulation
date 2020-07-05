import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;

  div {
    width: 100%;

    h1 {
      margin-bottom: 1rem;
    }
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;

  div {
    display: block;
  }

  svg {
    color: #e8e8e8;
  }

  #server {
    color: #0455bf;
  }
`;

export const OptionsContainer = styled.div`
  z-index: 100;
  position: absolute;
  top: 20;
  left: 20;
  width: 100%;
  padding: 2rem;

  .ant-select {
    width: 150px;
  }
`;

export const TableWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;

  .table-container {
    height: 180px;
    overflow-y: auto;
  }

  div {
    table {
      width: 90%;
      table-layout: fixed;
      margin: 1rem auto;
      border: none;
      border-collapse: separate;
      border-spacing: 0;

      th {
        width: 25%;
        padding: 4px;
        border: 1px solid #e8e8e8;
        text-align: center;
      }
      td {
        width: 25%;
        padding: 4px;
        border: 1px solid #e8e8e8;
        text-align: center;
      }

      tr {
        &:first-child th:not(:first-child):not(:last-child) {
          border-right: none;
        }

        &:first-child th:first-child {
          border-top-left-radius: 5px;
          border-right: none;
        }

        &:first-child th:last-child {
          border-top-right-radius: 5px;
        }

        &:last-child td:not(:first-child):not(:last-child) {
          border-right: none;
          border-top: none;
        }

        &:last-child td:first-child {
          border-bottom-left-radius: 5px;
          border-top: none;
          border-right: none;
        }

        &:last-child td:last-child {
          border-top: none;
          border-bottom-right-radius: 5px;
        }
      }

      tbody {
        tr:not(:last-child) {
          td:not(:first-child):not(:last-child) {
            border-top: none;
            border-right: none;
          }

          td:first-child {
            border-top: none;
            border-right: none;
          }

          td:last-child {
            border-top: none;
          }
        }
      }
    }
  }

  @media only screen and (max-width: 576px) {
    .table-container {
      height: 230px;
    }
  }
  @media only screen and (min-width: 577px) and (max-width: 960px) {
    .table-container {
      height: 350px;
    }
  }
  @media only screen and (min-width: 961px) {
    .table-container {
      height: 450px;
    }
  }
`;

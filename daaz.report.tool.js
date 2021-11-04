// ==UserScript==
// @name         Daaz Orders Reporter
// @namespace    https://t.me/arthur_koba/
// @version      0.5
// @description  Create a page report for insertion into tables.
// @author       Arthur Koba
// @match        https://daazweb.com/dashboard/*
// @icon         https://www.google.com/s2/favicons?domain=daazweb.com
// @grant        none
// ==/UserScript==

(function() {
  function Reporter () {
    const self = {}
    console.log("Start Reporter extension.")
    self.copyReport = function () {
      const orders = document.querySelector(".projects-table")
                             .querySelectorAll("tbody tr")
      let data = []
      for (let orderNode of orders) {
        if (!orderNode.querySelector(".status .status-green")) {continue}
        if (document.location.pathname === "/dashboard/exchangeBtc") {
          let requisites = orderNode.querySelector(".req span").innerHTML
          let fiatAmount = orderNode.querySelectorAll("td p")[4].innerHTML
          let btcAmount = orderNode.querySelectorAll("td p")[6]
                                   .innerHTML.replace('.', ',')
          data.push(`${requisites}\t${fiatAmount}\t${btcAmount}`)
        } else if (document.location.pathname === "/dashboard/orders") {
          let phoneNumber = orderNode.querySelector(".req .no-toggle")
                                  .getAttribute("data-requisites")
          let btcAmount = orderNode.querySelector(".btc-amount .no-toggle span")
                               .innerHTML.replace('.', ',')
          let fiatAmount = orderNode.querySelector(".fiat-amount .no-toggle span")
                               .innerHTML.replace('.', ',')
          data.push(`${phoneNumber}\t${btcAmount}\t${fiatAmount}`)
        }
      }
      if (data) {
        navigator.clipboard.writeText(data.join('\n'))
        console.log('Отчет скопирован!')
      } else {console.warn('Отчет пуст!')}
    }

    self.initButton = function () {
      self.reportDivButton = document.createElement("div")
      self.reportDivButton.classList.add("report-div-button")
      self.reportDivButton.style.display = "inline-block"
      const reportButton = document.createElement("button")
      reportButton.classList.add("button")
      reportButton.style.width = "100%"
      reportButton.innerHTML = "Отчет"
      reportButton.addEventListener("click", self.copyReport)
      self.reportDivButton.appendChild(reportButton)
      self.tableItems.appendChild(self.reportDivButton)
    }

    self.loop = function () {
      self.projectHeaders = document.querySelector(".projects-header")
      if (!self.projectHeaders) {return}
      self.tableTitle = self.projectHeaders.querySelector(".table_title")
      self.tableItems = self.projectHeaders.querySelector(".row .col-12")
      self.reportDivButton = self.tableItems.querySelector(".report-div-button")
      self.count = self.projectHeaders.querySelector(".count #active_orders").innerHTML
      if (self.tableTitle.innerHTML === "Завершенные заявки" && self.count !== '0') {
        if (!self.reportDivButton && self.count !== '0') self.initButton()
      } else if (self.reportDivButton) {self.reportDivButton.remove()}
    }
    self.loopInterval = setInterval(self.loop, 1000)
    return self
  }
  const reporter = Reporter()
})();

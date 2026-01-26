import React from 'react'

const Dashboard = () => {
  return (
    <div className="card">
          <div className="card-header border-0">
            

            <div className="row">
          <div className="col-lg-3 col-6">
            <div className="small-box bg-info">
              <div className="inner">
                <h3>150</h3>

                <p>Ventas de esta semana</p>
              </div>
              <div className="icon">
                <i className="ion ion-bag"></i>
              </div>
              <a href="#" className="small-box-footer">M&aacute;s info <i className="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="small-box bg-success">
              <div className="inner">
                <h3>53<sup >%</sup></h3>

                <p>Clientes que volvieron a comprar</p>
              </div>
              <div className="icon">
                <i className="ion ion-stats-bars"></i>
              </div>
              <a href="#" className="small-box-footer">M&aacute;s info <i className="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="small-box bg-warning">
              <div className="inner">
                <h3>44</h3>

                <p>Nuevos Clientes</p>
              </div>
              <div className="icon">
                <i className="ion ion-person-add"></i>
              </div>
              <a href="#" className="small-box-footer">M&aacute;s info <i className="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="small-box bg-danger">
              <div className="inner">
                <h3>20</h3>

                <p>Clientes retrasados</p>
              </div>
              <div className="icon">
                <i className="ion ion-pie-graph"></i>
              </div>
              <a href="#" className="small-box-footer">M&aacute;s info <i className="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
        </div>
            
            <div className="row">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header border-0">
                <div className="d-flex justify-content-between">
                  <h3 className="card-title">Online Store Visitors</h3>
                  <a href="#" >View Report</a>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex">
                  <p className="d-flex flex-column">
                    <span className="text-bold text-lg">820</span>
                    <span>Visitors Over Time</span>
                  </p>
                  <p className="ml-auto d-flex flex-column text-right">
                    <span className="text-success">
                      <i className="fas fa-arrow-up"></i> 12.5%
                    </span>
                    <span className="text-muted">Since last week</span>
                  </p>
                </div>

                <div className="position-relative mb-4">
                  <div className="chart-placeholder" style={{height: '200px', backgroundColor: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <span className="text-muted">Gráfico de visitantes</span>
                  </div>
                </div>

                <div className="d-flex flex-row justify-content-end">
                  <span className="mr-2">
                    <i className="fas fa-square text-primary"></i> This Week
                  </span>

                  <span>
                    <i className="fas fa-square text-gray"></i> Last Week
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header border-0">
                <h3 className="card-title">Products</h3>
                <div className="card-tools">
                  <a href="#" className="btn btn-tool btn-sm">
                    <i className="fas fa-download"></i>
                  </a>
                  <a href="#" className="btn btn-tool btn-sm">
                    <i className="fas fa-bars"></i>
                  </a>
                </div>
              </div>
              <div className="card-body table-responsive p-0">
                <table className="table table-striped table-valign-middle">
                  <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Sales</th>
                    <th>M&aacute;s</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>
                      <img src="/img/logo_electrovenza.png" alt="Product 1" className="img-circle img-size-32 mr-2" />
                      Some Product
                    </td>
                    <td>$13 USD</td>
                    <td>
                      <small className="text-success mr-1">
                        <i className="fas fa-arrow-up"></i>
                        12%
                      </small>
                      12,000 Sold
                    </td>
                    <td>
                      <a href="#" className="text-muted">
                        <i className="fas fa-search"></i>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img src="/img/logo_electrovenza.png" alt="Product 1" className="img-circle img-size-32 mr-2" />
                      Another Product
                    </td>
                    <td>$29 USD</td>
                    <td>
                      <small className="text-warning mr-1">
                        <i className="fas fa-arrow-down"></i>
                        0.5%
                      </small>
                      123,234 Sold
                    </td>
                    <td>
                      <a href="#" className="text-muted">
                        <i className="fas fa-search"></i>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img src="/img/logo_electrovenza.png" alt="Product 1" className="img-circle img-size-32 mr-2" />
                      Amazing Product
                    </td>
                    <td>$1,230 USD</td>
                    <td>
                      <small className="text-danger mr-1">
                        <i className="fas fa-arrow-down"></i>
                        3%
                      </small>
                      198 Sold
                    </td>
                    <td>
                      <a href="#" className="text-muted">
                        <i className="fas fa-search"></i>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img src="/img/logo_electrovenza.png" alt="Product 1" className="img-circle img-size-32 mr-2" />
                      Perfect Item
                      <span className="badge bg-danger">NEW</span>
                    </td>
                    <td>$199 USD</td>
                    <td>
                      <small className="text-success mr-1">
                        <i className="fas fa-arrow-up"></i>
                        63%
                      </small>
                      87 Sold
                    </td>
                    <td>
                      <a href="#" className="text-muted">
                        <i className="fas fa-search"></i>
                      </a>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header border-0">
                <div className="d-flex justify-content-between">
                  <h3 className="card-title">Sales</h3>
                  <a href="javascript:void(0);">View Report</a>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex">
                  <p className="d-flex flex-column">
                    <span className="text-bold text-lg">$18,230.00</span>
                    <span>Sales Over Time</span>
                  </p>
                  <p className="ml-auto d-flex flex-column text-right">
                    <span className="text-success">
                      <i className="fas fa-arrow-up"></i> 33.1%
                    </span>
                    <span className="text-muted">Since last month</span>
                  </p>
                </div>

                <div className="position-relative mb-4">
                  <div className="chart-placeholder" style={{height: '200px', backgroundColor: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <span className="text-muted">Gráfico de ventas</span>
                  </div>
                </div>

                <div className="d-flex flex-row justify-content-end">
                  <span className="mr-2">
                    <i className="fas fa-square text-primary"></i> This year
                  </span>

                  <span>
                    <i className="fas fa-square text-gray"></i> Last year
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header border-0">
                <h3 className="card-title">Online Store Overview</h3>
                <div className="card-tools">
                  <a href="#" className="btn btn-sm btn-tool">
                    <i className="fas fa-download"></i>
                  </a>
                  <a href="#" className="btn btn-sm btn-tool">
                    <i className="fas fa-bars"></i>
                  </a>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center border-bottom mb-3">
                  <p className="text-success text-xl">
                    <i className="ion ion-ios-refresh-empty"></i>
                  </p>
                  <p className="d-flex flex-column text-right">
                    <span className="font-weight-bold">
                      <i className="ion ion-android-arrow-up text-success"></i> 12%
                    </span>
                    <span className="text-muted">CONVERSION RATE</span>
                  </p>
                </div>
                <div className="d-flex justify-content-between align-items-center border-bottom mb-3">
                  <p className="text-warning text-xl">
                    <i className="ion ion-ios-cart-outline"></i>
                  </p>
                  <p className="d-flex flex-column text-right">
                    <span className="font-weight-bold">
                      <i className="ion ion-android-arrow-up text-warning"></i> 0.8%
                    </span>
                    <span className="text-muted">SALES RATE</span>
                  </p>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-0">
                  <p className="text-danger text-xl">
                    <i className="ion ion-ios-people-outline"></i>
                  </p>
                  <p className="d-flex flex-column text-right">
                    <span className="font-weight-bold">
                      <i className="ion ion-android-arrow-down text-danger"></i> 1%
                    </span>
                    <span className="text-muted">REGISTRATION RATE</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

          </div>
          
        </div>
  )
}

export default Dashboard ;
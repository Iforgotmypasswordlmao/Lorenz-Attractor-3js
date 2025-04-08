export class Lorenz
{
    /**
     * @param {object} variables
     * @param {number} variables.sigma 
     * @param {number} variables.rho 
     * @param {number} variables.beta 
     * @param {object} initPos
     */
    constructor(variables, position)
    {
        this.sigma = variables['sigma']
        this.rho = variables['rho']
        this.beta = variables['beta']
        this.position = {...position}
        this.velocity = {
            'dx': 0,
            'dy': 0,
            'dz': 0
        }
    }

    updateVelocity()
    {
        this.velocity['dx'] = ( this.sigma*(this.position['y'] - this.position['x']) )
        this.velocity['dy'] = ( this.position['x']*(this.rho - this.position['z']) ) - this.position['y']
        this.velocity['dz'] = ( this.position['x']*this.position['y'] ) - ( this.position['z']*this.beta )
    }

    /**
     * 
     * @param {number} deltaTime 
     */
    updatePosition(deltaTime)
    {
        this.position['x'] += (this.velocity['dx']*deltaTime)
        this.position['y'] += (this.velocity['dy']*deltaTime)
        this.position['z'] += (this.velocity['dz']*deltaTime)
    }

}
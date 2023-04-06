# Chamat Timber Mart

App is getting developed in node v16.17.0 & npm 8.15.0

<h2>Important commands to run during setup</h2>
<table>
<tr>
<th>Name</th>
<th>Command</th>
<th>Description</th>
</tr>
<tr>
<td>Generate public and Private Keys</td>
<td>node src/utils/generatePublicPrivateKeys.ts</td>
<td>
  <ul>
    <li>Run this command in terminal/console from root directory</li>
    <li>without PUBLIC AND PRIVATE KEY app ll not start</li>   
  </ul> 
</td>
</tr>
<tr>
<td>Generate Refresh Token</td>
<td>node src/utils/generateRandomKeys.ts</td>
<td>
  <ul>
    <li>Run this command in terminal/console from root directory</li>
    <li>Copy any one of the key and paste that key in .env file in REFRESH_TOKEN_SECRET variable</li>   
    <li>without REFRESH_TOKEN_SECRET app ll not start</li>   
  </ul> 
</td>
</tr>

</table>
<h2>Third party services used</h2>
<table>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
<tr>
<td>-</td>
<td>-</td>
</tr>
</table>
<h2>Vs code Extension</h2>
Please install this extensions for maintaining coding standards
<table>
  <th>Plugin Name</th>
  <th>Installation Link</th>
  <th>Description</th>
  <tr>
    <td>Prettier - Code formatter</td>
    <td>https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode</td>
    <td> - NA -</td>
  </tr>
  <tr>
    <td>ESLint</td>
    <td>https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint</td>
    <td> - NA -</td>
  </tr>
  <tr>
    <td>REST Client</td>
    <td>https://marketplace.visualstudio.com/items?itemName=humao.rest-client</td>
    <td>
      <ul>
        <li>All api's are kept in 'restApi' folder</li>
        <li>Env variables are kept in .vscode/settings.json</li>
        <li>Env variables are set inside 'rest-client.environmentVariables' object</li>
        <li>While working, please select Enviornment to local by going to any .http file and pressing Ctrl+Alt+E </li>
      </ul>
    </td>
  </tr>
</table>

<h2> API format </h2>
Api format that we are following
<table>
  <tr>
    <th>Type</th>
    <th>api</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>GET</td>
    <td>/user</td>
    <td>Get all data of the user table </td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/user/1</td>
    <td>Get detail data of the given id of the user</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/user</td>
    <td>for storing the data in DB</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/user</td>
    <td>for updating the data in DB</td>
  </tr>
  <tr>
    <td>Delete</td>
    <td>/user/1</td>
    <td>for deleting the enteries in DB</td>
  </tr>
</table>

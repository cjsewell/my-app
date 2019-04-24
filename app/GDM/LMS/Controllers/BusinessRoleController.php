<?php
/**
 * Created by PhpStorm.
 * User: kartik
 * Date: 2019-04-21
 * Time: 14:06
 */

namespace GDM\LMS\Controllers {

    use GDM\LMS\Models\BusinessRole;
    use SilverStripe\Control\Controller;
    use SilverStripe\Control\HTTPRequest;
    use SilverStripe\Dev\Debug;


    /**
     * Class BusinessRoleController
     * @package GDM\LMS\Controllers
     */
    class BusinessRoleController extends Controller
    {
        private static $allowed_actions = [
            'Add',
            'GetAll',
            'Delete',
            'Update'
        ];

        private static $url_handlers = [
            'add' => 'Add',
            'get' => 'GetAll',
            'delete/$ID' => 'Delete',
            'edit/$ID' => 'Update'
        ];


        public function Add(HTTPRequest $request)
        {
            if ($request) {
                $object = json_decode($request->getBody());
                $model = BusinessRole::create();
                $model->Name = $object->name;
                $model->write();
            }
        }

        /**
         * @param HTTPRequest $request
         * @return \SilverStripe\Control\HTTPResponse
         * @throws \SilverStripe\ORM\ValidationException
         */
        public function Update(HTTPRequest $request)
        {
            $id = $request->getVar('ID');
            $model = $id ? BusinessRole::get()->byID($id) : BusinessRole::create();
            $model->Name = $request->getVar('role');

            $model->write();

            return $this->getResponse()
                ->setStatusDescription('Business Role has been updated')
                ->setStatusCode(200);
        }

        /**
         * @return \SilverStripe\Control\HTTPResponse|string
         *
         * Gets all business roles in the database
         */
        public function GetAll()
        {
            return $this->getResponse()
                ->addHeader('Content-Type', 'application/json')
                ->setBody(json_encode(BusinessRole::get()->toNestedArray()));
        }

        /**
         * @param HTTPRequest $request
         *
         * Deletes a particular business role based on the ID
         */
        public function Delete(HTTPRequest $request)
        {
            $id = $request->param('ID');
            $role = BusinessRole::get()->byID($id);
            if ($role && $role->ID > 0) {
                $role->delete();
            }

            return $this->getResponse()
                ->setStatusDescription('Business Role Deleted')
                ->setStatusCode(200);
        }
    }
}